# 非同期 SaaS 注文処理ワークフロー

このプロジェクトは、AWS 上で構築したイベント駆動型の注文処理ワークフローです。

公開ポートフォリオページから API Gateway 経由でデモ注文を作成します。バックエンドでは、注文状態を DynamoDB に保存し、注文イベントを SNS に発行し、SQS と Lambda によって非同期処理を行い、更新された注文状態をフロントエンドへ返します。

目的は、実務で使われるクラウド運用パターンを示すことです。ユーザー向けのリクエストは素早く受け付け、時間のかかる後続処理は非同期ワークフローに移し、状態を追跡し、失敗時にはデッドレターキューで処理し、公開エンドポイントには監視と自動的な封じ込めを追加しています。

## アーキテクチャ

通常の注文処理フロー:

    CloudFront ポートフォリオページ
      -> API Gateway HTTP API
      -> Publisher Lambda
      -> DynamoDB 注文レコード
      -> SNS 注文イベントトピック
      -> SQS 処理キュー
      -> Processor Lambda
      -> DynamoDB 状態更新

注文状態の確認フロー:

    CloudFront ポートフォリオページ
      -> API Gateway HTTP API
      -> Status Lambda
      -> DynamoDB 状態読み取り

追加ブランチと運用制御:

    SNS 注文イベントトピック
      -> SQS 監査キュー

    SNS 注文イベントトピック
      -> SQS 通知キュー
      -> Notifier Lambda
      -> Amazon SES
      -> 検証済みメールアドレス
      -> 検証後に無効化

    SQS 処理キュー
      -> 再試行
      -> デッドレターキュー

    CloudWatch アラーム
      -> SNS 安全通知トピック
      -> メール通知
      -> 緊急停止 Lambda
      -> 公開 Publisher Lambda の予約済み同時実行数を 0 に設定

## 使用した AWS サービス

- Amazon API Gateway
- AWS Lambda
- Amazon DynamoDB
- Amazon SNS
- Amazon SQS
- Amazon SES
- Amazon CloudWatch
- AWS IAM
- Amazon CloudFront

## デモの動作

公開プロジェクトページには、デモ注文を作成するテストボタンがあります。

ボタンをクリックすると、次の処理が行われます。

1. ブラウザが API Gateway に POST /orders リクエストを送信します。
2. API Gateway が project3-order-publisher を呼び出します。
3. Publisher Lambda が backgroundStatus = PENDING の注文アイテムを DynamoDB に書き込みます。
4. Publisher Lambda が ORDER_CONFIRMED イベントを SNS に発行します。
5. SNS がイベントを複数の SQS キューへ配信します。
6. 処理キューが project3-order-processor を呼び出します。
7. Processor Lambda が DynamoDB アイテムを backgroundStatus = COMPLETED に更新します。
8. フロントエンドが API Gateway 経由で GET /orders/{orderId} をポーリングします。
9. Status Lambda が DynamoDB から現在の注文状態を読み取ります。
10. ページにバックグラウンドワークフローの完了状態が表示されます。

## 主なリソース

| リソース | 名前 |
|---|---|
| DynamoDB テーブル | project3-orders |
| SNS トピック | project3-order-events |
| 処理キュー | project3-order-processing-queue |
| 監査キュー | project3-order-audit-queue |
| 通知キュー | project3-order-notification-queue |
| デッドレターキュー | project3-order-dlq |
| Publisher Lambda | project3-order-publisher |
| Processor Lambda | project3-order-processor |
| Status Lambda | project3-order-status |
| Notifier Lambda | project3-order-notifier |
| 緊急停止 Lambda | project3-emergency-disable-demo |
| HTTP API | project3-order-workflow-api |

## 失敗処理

処理キューにはデッドレターキューを設定しています。

Processor Lambda がメッセージ処理に繰り返し失敗した場合、そのメッセージはキューから削除されません。SQS は配信を再試行します。設定された受信回数の上限に達すると、SQS はそのメッセージを project3-order-dlq に移動します。

これは、次のような意図的な poison test message で検証しました。

    {
      "orderId": "ORD-DLQ-TEST-001",
      "simulateFailure": true
    }

Processor Lambda は意図的にエラーを発生させ、メッセージは再試行された後、デッドレターキューへ移動されました。

## 通知ブランチ

Amazon SES を使用した通知ブランチも実装し、検証しました。

    SNS トピック
      -> SQS 通知キュー
      -> Notifier Lambda
      -> Amazon SES
      -> 検証済みメール受信箱

このブランチでは、次のテスト注文についてメール送信に成功しました。

    ORD-SES-TEST-001

検証後、この通知ブランチは公開デモから切り離しました。訪問者がデモボタンをクリックするたびに不要なメールが送信されることを防ぐためです。

最終状態としては、通知パスは実装・検証済みですが、公開トラフィックに対しては有効化していません。

## 運用上の安全対策

このプロジェクトでは公開 API エンドポイントを使用しているため、公開 Publisher Lambda を CloudWatch アラームで監視しています。

安全制御:

    メトリクス: project3-order-publisher Invocations
    しきい値: 5 分間で 50 回を超える呼び出し
    アクション 1: メール通知を送信
    アクション 2: 緊急停止 Lambda を呼び出す

緊急停止 Lambda は PutFunctionConcurrency を呼び出し、project3-order-publisher の予約済み同時実行数を 0 に設定します。

これにより、異常なトラフィックが検出された場合、公開注文作成関数を即座にスロットリングできます。復旧時には、予約済み同時実行数の設定を削除または変更することで手動で再有効化できます。

この制御はシンプルですが、公開クラウドエントリーポイントには監視、通知、封じ込めが必要であるという運用上の考慮を示しています。

## IAM 設計

各 Lambda 関数には、その役割に必要な権限だけを持つ専用の実行ロールを使用しています。

例:

- Publisher Lambda は注文テーブルへの書き込みと SNS への発行ができます。
- Processor Lambda は処理キューからの読み取りと DynamoDB の更新ができます。
- Status Lambda は DynamoDB からの読み取りができます。
- Notifier Lambda は通知キューからの読み取りと SES によるメール送信ができます。
- 緊急停止 Lambda は公開 Publisher Lambda の同時実行数設定だけを変更できます。

これにより、各関数の責任範囲に合わせて権限を絞っています。

## コストとクリーンアップ

このプロジェクトは、非常に低コストで維持できるように設計しています。

- Lambda の利用量は最小限です。
- DynamoDB には小さなテストアイテムのみを保存しています。
- SQS と SNS のトラフィックは非常に少量です。
- SES は一度検証し、その後公開デモから切り離しました。
- CloudWatch は運用可視性のために使用しています。
- AWS Budgets はコストレベルの安全対策として有効です。

公開デモは有効なままですが、SES 通知ブランチは不要なメール送信を防ぐため無効化しています。

## 証跡

以下の証跡を別途取得しました。

- 公開プロジェクトページによるデモ注文作成
- API Gateway の POST /orders と GET /orders/{orderId} の成功レスポンス
- DynamoDB アイテムが PENDING から COMPLETED へ変化したこと
- Processor Lambda の CloudWatch Logs
- DLQ テストメッセージと再試行動作
- SES メール配信の証跡
- CloudWatch アラームと緊急停止 Lambda による安全対策

必要に応じて、後でスクリーンショットをこのフォルダに追加できます。

## 公開デモの運用上の安全対策

このデモでは公開APIエンドポイントを使用しているため、公開側の Publisher Lambda に対して運用上の安全対策を追加しました。

CloudWatch アラームで `project3-order-publisher` の異常な呼び出し数を監視しています。設定したしきい値を超えた場合、アラームは SNS を通じてメール通知を送信し、緊急停止用の Lambda 関数を実行します。

緊急停止用 Lambda は、公開 Publisher 関数の reserved concurrency を `0` に設定します。これにより、公開デモの入口を自動的に停止できます。予期しないアクセスが発生した場合でも、シンプルでコストを抑えた構成のまま、自動的な封じ込めが可能になります。

デモを再開する場合は、reserved concurrency の制限を削除するか、小さい安全な値に戻します。

## SES 通知ブランチ

このアーキテクチャには、SNS、SQS、Lambda、Amazon SES を使用した通知ブランチも含まれています。

このブランチは実装し、次の経路でテスト確認済みです。

`SNS topic → SQS notification queue → Notification Lambda → Amazon SES`

確認後、公開デモからはこの通知ブランチを切り離しました。これにより、公開ボタンが繰り返し押された場合でも、不要なメール送信が発生しないようにしています。

公開デモでは、引き続き中核となる非同期ワークフローを確認できます。

`API Gateway → Publisher Lambda → DynamoDB → SNS → SQS processing queue → Processor Lambda → DynamoDB status update`
