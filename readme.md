# クラウド運用ポートフォリオ

[English version](readme-en.md)

実践的なAWS / クラウド運用スプリントです。クラウドデプロイ、Linuxでの作業、Git/GitHub、IAM設計、CI/CD、イベント駆動アーキテクチャ、Infrastructure as Code、運用トラブルシューティングを示すために、実際に動作するシステムとして構築・デプロイしています。

**ライブサイト:** https://d1rzzxjs182iar.cloudfront.net

## プロジェクト一覧

| プロジェクト | 示している内容 | 状態 |
|---|---|---|
| **[このポートフォリオサイト](#プロジェクト概要)** — プライベートS3 + CloudFront、GitHub Actions OIDCデプロイ、サーバーレス訪問者カウンター | S3、CloudFront、IAMロール、OIDC、Python/boto3自動化、API Gateway、Lambda、DynamoDB、CORS、CloudWatch | 稼働中 |
| **[セキュアなVPC基盤](projects/secure-vpc-foundation/)** — パブリックALBとプライベートEC2/RDS層を持つマルチAZネットワーク | VPC、サブネット、ルートテーブル、セキュリティグループ、ALB、Auto Scaling、RDS、NAT Gateway、S3 Gateway Endpoint、CloudFormation、Terraform | 構築・検証・削除済み |
| **[非同期SaaS注文処理ワークフロー](projects/event-driven-order-processing-workflow/)** — ライブデモ付きのイベント駆動型注文処理 | API Gateway、Lambda、SNS、SQS、DynamoDB、SES、デッドレターキュー、CloudWatchアラーム、自動封じ込め、CloudTrail | 稼働中 |

各プロジェクトは、単発のサービス演習ではなく、採用しなかった選択肢とその理由も含めて、動作するシステムとして文書化しています。

以下はポートフォリオサイト自体の内容です。各プロジェクトには、アーキテクチャ、証跡、クリーンアップ記録を含む個別のREADMEがあります。

## プロジェクト概要

このプロジェクトは、AWS上にデプロイされたバイリンガルのポートフォリオサイトです。Git履歴、プロジェクトメモ、可視化されたデプロイ進捗を通じて作業内容を明確に記録しながら、小規模ながら実際に動作するクラウドホスト型システムを構築することを目的としています。

サイトはバニラHTML、CSS、JavaScriptで構成されています。英語 / 日本語の言語切り替え、認定資格の確認リンク、現在のプロジェクト進捗を示すビルドステータスを含んでいます。

このプロジェクトは、実践的な運用ラボとしても使用しています。デプロイ、権限、キャッシュ無効化、アカウント保護、運用上のガードレールを、構築作業の一部として意図的にドキュメント化しています。

## 現在の構成

* 静的サイトファイルは、プライベートなAmazon S3バケットに保存しています。
* CloudFrontが公開HTTPSエンドポイントを提供しています。
* S3バケットはパブリックに公開していません。
* バケットポリシーにより、CloudFrontがプライベートS3バケットから読み取れるようにしています。
* 通常運用ではCloudFrontキャッシュを有効にしています。
* S3上のファイルを更新した場合、デプロイ済みサイトを更新するためにCloudFront invalidationを一度だけ作成します。

## サーバーレス訪問者カウンターのバックエンド

このポートフォリオサイトには、小さなサーバーレスバックエンド機能として、サイトフッターに表示される訪問者カウンターを実装しています。

サイトが読み込まれると、ブラウザのJavaScriptがAPI Gateway HTTP APIのルートに対して`POST`リクエストを送信します。

```text
POST /visit
```

API GatewayはPython Lambda関数を呼び出します。Lambda関数はAPI Gatewayのリクエストメタデータから訪問者の送信元IPを取得し、Lambda環境変数として保存しているsaltと組み合わせ、SHA-256でハッシュ化します。その結果のハッシュのみをDynamoDBに保存します。

生のIPアドレスは保存していません。

DynamoDBテーブルには、2種類のレコードを保存しています。

```text
visitor_hash = ハッシュ化された訪問者識別子
visitor_hash = "__stats__"
```

通常の訪問者レコードでは、次の情報を記録します。

```text
first_seen
last_seen
visit_count
```

`__stats__`レコードでは、サイト全体の集計値を記録します。

```text
total_visits
unique_visitors
last_updated
```

Lambda関数は、訪問者ごとのレコードとグローバル集計レコードの両方を更新し、その後、最新の集計値をフロントエンドに返します。JavaScriptはレスポンスを受け取り、ライブサイトのフッターに表示される訪問者カウンターを更新します。

現在のバックエンドフローは次の通りです。

```text
ブラウザがCloudFrontサイトを読み込む
→ script.jsがAPI Gateway /visit にPOSTリクエストを送信
→ API GatewayがVisitorCounterFunctionを呼び出す
→ Lambdaが訪問者識別子をハッシュ化する
→ LambdaがDynamoDBの訪問者レコードを更新する
→ LambdaがDynamoDBの__stats__レコードを更新する
→ Lambdaがtotal_visitsとunique_visitorsを返す
→ JavaScriptがフッターにカウンターを表示する
```

この機能では、次の内容を示しています。

* API Gateway HTTP APIのルーティング
* Lambda統合
* Python Lambdaによるバックエンド処理
* DynamoDBによる状態管理
* 新規訪問者判定のための条件付き書き込み
* アトミックなカウンター更新
* Lambda環境変数
* LambdaからDynamoDBへの最小権限IAMアクセス
* ブラウザからAPIへの通信に必要なCORS設定
* JavaScript `fetch`を使ったフロントエンド / バックエンド連携
* 開発中のCloudWatchログ確認とトラブルシューティング

フッターのカウンターは、意図的にサイト上に表示しています。これは、背後にあるバックエンドスタックの小さな証拠として機能します。表示される数値はハードコードではなく、API GatewayとLambdaを経由してDynamoDBから返される値です。

## ホスティング方針

このプロジェクトでは、S3 static website hostingを意図的に無効にしています。

このサイトは、プライベートS3バケットをオリジンとして、CloudFront経由で配信しています。これにより、S3バケットをプライベートに保ちながら、CloudFrontが公開HTTPSエンドポイントを提供します。

AWS Amplify Hostingも使用していません。Amplifyは便利なマネージドホスティングですが、このプロジェクトでは、基礎となるクラウド運用作業を示すために、S3とCloudFrontを直接使用しています。具体的には、プライベートバケットアクセス、CloudFront配信、バケットポリシー設定、キャッシュ無効化、IAMガードレール、将来のデプロイ自動化を扱っています。

## IAMと権限モデル

このプロジェクトでは、通常のコンソール作業にAWS root accountを使用していません。

現在のアクセスモデルは次の通りです。

* Root account:

  * アカウントレベルまたは緊急時のタスクにのみ使用します。
  * MFAを有効にしています。
  * 通常のプロジェクト作業には使用しません。

* IAM admin user:

  * 通常のAWSコンソール管理に使用します。
  * 学習およびプロジェクト構築作業のため、広い権限を持つadminグループに追加しています。
  * 通常利用においてMFAを有効にするべきです。

* Deployment automation:

  * 可能な限り、ロールベースのアクセスと一時的な権限を使用します。
  * PythonデプロイツールとGitHub Actionsワークフローを使用しています。
  * デプロイ権限は、S3へのウェブサイトファイルアップロードやCloudFront invalidation作成など、必要な操作に限定しています。

## デプロイ認証モデル

このプロジェクトでは、意図的に分離したデプロイ認証モデルを使用しています。

ローカルでのデプロイテストにおけるチェーンは次の通りです。

```text
Local AWS profile
→ IAM user credentials
→ AssumeRole
→ temporary deploy role credentials
→ S3 upload
→ CloudFront invalidation
```

これは、1つのIAMユーザーに直接デプロイ権限を与えるよりも複雑です。しかし、これは意図的な設計です。目的は、**認証元**と**デプロイ権限セット**を分離し、同じデプロイロールをGitHub Actionsでも再利用できるようにすることです。

### コンポーネント

| コンポーネント                 | 種類                    | 目的                                                                   |
| ----------------------- | --------------------- | -------------------------------------------------------------------- |
| `portfolio-role-runner` | AWS IAM user          | 長期アクセスキーを持つローカル用のブートストラップID                                          |
| `portfolio-runner`      | Local AWS CLI profile | IAMユーザーの認証情報を保存・使用するローカルUbuntuプロファイル                                 |
| `PortfolioDeployRole`   | AWS IAM role          | S3アップロードとCloudFront invalidation権限を持つ一時的なデプロイID                      |
| `portfolio-deploy`      | Local AWS CLI profile | `portfolio-runner`を使って`PortfolioDeployRole`をassumeするローカルUbuntuプロファイル |

似た名前のコンポーネントは、それぞれ別のものです。

```text
portfolio-role-runner = AWS IAM user
portfolio-runner      = そのユーザーのアクセスキーを使うローカルAWSプロファイル
PortfolioDeployRole   = デプロイ権限を持つAWS IAMロール
portfolio-deploy      = デプロイロールをassumeするローカルAWSプロファイル
```

### IAMユーザーが直接デプロイしない理由

より単純なローカル専用設計であれば、次のようにすることもできます。

```text
IAM user access key
→ S3 upload
→ CloudFront invalidation
```

これは機能しますし、小規模なローカル専用プロジェクトであれば、より簡単です。

しかし、このプロジェクトでは次の流れを使用しています。

```text
IAM user access key
→ assume deploy role
→ temporary role credentials
→ S3 upload
→ CloudFront invalidation
```

IAMユーザー`portfolio-role-runner`は、デプロイ権限を直接所有するためのものではありません。その目的は、ローカルで認証し、`PortfolioDeployRole`の一時的な認証情報をリクエストすることだけです。

実際のデプロイ権限は`PortfolioDeployRole`にあります。

つまり、デプロイ権限セットはロールに付与されており、特定のローカルIAMユーザーに恒久的に紐づいているわけではありません。現在、GitHub ActionsはOIDCを使用して同じロールをassumeしており、デプロイ元としてのローカルIAMユーザーアクセスキーを置き換えています。

### ローカルプロファイルの流れ

ローカルプロファイル`portfolio-runner`には、開始地点となる認証情報が含まれています。

ローカルプロファイル`portfolio-deploy`には、ロールをassumeするための設定が含まれています。

```text
source_profile = portfolio-runner
role_arn       = PortfolioDeployRole
```

Python/boto3が`portfolio-deploy`プロファイルを使用すると、boto3は次のチェーンを実行します。

```text
Python deploy script starts
        ↓
boto3 uses local profile: portfolio-deploy
        ↓
portfolio-deploy points to source_profile: portfolio-runner
        ↓
boto3 loads portfolio-runner credentials
        ↓
AWS authenticates the IAM user: portfolio-role-runner
        ↓
AWS checks whether the user may call sts:AssumeRole
        ↓
AWS checks whether PortfolioDeployRole trusts that user
        ↓
AWS returns temporary credentials for PortfolioDeployRole
        ↓
boto3 uses the temporary role credentials
        ↓
Python uploads files to S3
        ↓
Python creates a CloudFront invalidation
```

重要な点は次の通りです。

```text
ロールは直接認証しない。
IAMユーザーが先に認証する。
その後、AWSがロール用の一時的な認証情報を発行する。
```

### 必要な権限

IAMユーザー`portfolio-role-runner`に必要なのは、次の操作を呼び出す権限だけです。

```text
sts:AssumeRole
```

対象は次のロールです。

```text
PortfolioDeployRole
```

ロール`PortfolioDeployRole`には、実際のデプロイ権限があります。

```text
s3:PutObject
cloudfront:CreateInvalidation
```

これらは、ポートフォリオ用S3バケットとCloudFrontディストリビューションにスコープされています。

デプロイIDには、次の権限は不要です。

```text
s3:DeleteObject
s3:DeleteBucket
s3:PutBucketPolicy
s3:DeleteBucketPolicy
s3:PutLifecycleConfiguration
```

### トレードオフ

ローカル専用デプロイであれば、この設計は必要以上に複雑です。

`S3:PutObject`と`cloudfront:CreateInvalidation`だけを許可したIAMユーザーを直接使用する設計でも有効です。

それでもこのプロジェクトでロールベースの設計を使っている理由は、意図している最終構成により近いからです。

```text
today:
Local IAM user key
→ assume PortfolioDeployRole
→ run Python deployment

CI/CD:
GitHub Actions OIDC
→ assume PortfolioDeployRole
→ run Python deployment
```

ローカルIAMユーザーは、学習とローカルテストのための一時的な足場でした。現在、通常のデプロイはGitHub Actionsに移行しているため、通常運用のデプロイは恒久的なローカルIAMユーザーアクセスキーに依存していません。

### 望ましい最終デプロイフロー

意図している最終ワークフローは次の通りです。

```text
git push
→ GitHub Actions starts
→ GitHub assumes PortfolioDeployRole
→ Python deployment script runs
→ files are uploaded to S3
→ CloudFront invalidation is created
```

この段階では、通常のデプロイに必要なのは次の操作だけになります。

```bash
git add .
git commit -m "Update portfolio"
git push
```

通常のデプロイにおいて、AWSコンソールへの手動ログインは不要です。

## S3保護ガードレール

この小規模な静的デプロイ用バケットでは、S3 Bucket Versioningは意図的に有効にしていません。

理由は次の通りです。

* Git/GitHubをウェブサイトファイルのsource of truthとして扱います。
* S3はデプロイ先であり、主要なバージョン履歴ではありません。
* 通常のデプロイでは、既存ファイルを上書きできる必要があります。
* S3 Versioningを有効にすると、現在のプロジェクトには不要なライフサイクル管理とストレージ管理の複雑さが増えます。

代わりに、IAM admin userによる誤操作のリスクを下げるため、バケットポリシーに明示的なdenyガードレールを含めています。

IAM admin userはデプロイ済みファイルを更新できますが、次のような操作は拒否されます。

* デプロイ済みオブジェクトの削除
* バケットの削除
* バケットポリシーの削除または変更
* オブジェクトを削除し得るライフサイクル設定

IAM admin userセッションから`script.js`の削除とバケットポリシー削除を試みることでテストしました。どちらの操作も拒否されました。

## コストと運用ガードレール

このプロジェクトは予測可能な小さなコスト範囲に収まることを目指しています。
公開エンドポイントにはスロットリングと封じ込めを設け、トラフィック急増による
コストへの影響を抑えています。ただし、請求額の上限を保証するものではありません。

### アカウントレベル

* AWS Budgets をアカウントレベルのコストアラームとして設定しています。
* Secure VPC Foundation ラボは、検証後に稼働させたままにせず完全に削除しました。
  NAT Gateway と RDS はこのポートフォリオで最も費用のかかるリソースだからです。
  クリーンアップ手順と証跡は該当プロジェクトに記録しています。
* SES 通知ブランチは実装・検証したうえで公開デモから切り離しているため、訪問者
  がボタンを押してもメールは送信されません。

### 公開エンドポイントの保護

公開された未認証のエンドポイントは 2 つあります。訪問者カウンター
（`POST /visit`）と注文ワークフローのデモ（`POST /orders`）です。どちらも同じ
2 層構成で保護しています。バックエンドに到達するトラフィックを抑えるレート
制限と、呼び出し数が増加した場合に封じ込めるアラーム連動のキルスイッチです。

| エンドポイント | レート制限 | バースト | 理由 |
|---|---|---|---|
| 訪問者カウンター | 5 req/秒 | 10 | ページ読み込みごとに発火。DynamoDB の訪問者レコードと集計カウンターを更新 |
| 注文ワークフロー | 2 req/秒 | 5 | ボタン押下による明示的な操作。1 リクエストで DynamoDB 書き込み、SNS 発行、SQS へのファンアウト、2 つ目の Lambda 起動が発生 |

スロットリングを第一の防御策としたのは、設定に費用がかからず、アラームの発動前に
後続の処理量を抑えられるためです。API Gateway のスロットリングはベストエフォート
であり、リクエスト数や支出の厳密な上限を保証するものではありません。
[AWS のスロットリングに関する説明](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-throttling.html)を参照してください。
AWS WAF も検討しましたが、より柔軟なルール設定が可能な一方で月額費用が発生する
ため、ポートフォリオのデモには見合わないと判断しました。

スロットリングはレートを制限しますが継続時間は制限しないため、両方の関数を
CloudWatch アラームでも監視しています。注文ワークフローでは、メール購読者と
封じ込め Lambda を登録した SNS 安全通知トピックを使用しています。訪問者
カウンターのアラームは `project3-demo-safety-alerts` へ SNS 通知を送信し、
別のアラームアクションとして `visitor-counter-emergency-disable` を直接呼び出し
ます。各封じ込め Lambda は対象関数の予約済み同時実行数を 0 に設定し、手動で
解除するまで呼び出しを停止します。

公開エンドポイントごとに専用の封じ込め Lambda を用意し、それぞれの実行ロールは
1 つの関数 ARN に対する `lambda:PutFunctionConcurrency` のみに限定しています。

| 封じ込め Lambda | 対象 |
|---|---|
| `project3-emergency-disable-demo` | `project3-order-publisher` |
| `visitor-counter-emergency-disable` | `VisitorCounterFunction` |

1 つの Lambda で両方を扱う場合、そのロールは両方の関数を対象に含める必要があり、
不具合や想定外のイベントによって誤ったエンドポイントを停止させる可能性がありま
す。ロールを分けることで、一方の関数がもう一方に影響を与えること自体が不可能に
なります。制約をアプリケーションのロジックではなく IAM 側に置く設計であり、
コードの重複というわずかな代償で影響範囲を小さくしています。

訪問者カウンターの封じ込め経路は、復旧手順まで含めて実際にテストしました。
テスト内容と証跡は
[backend/visitor-counter/README.md](backend/visitor-counter/README.md)
に記載しています。

### ツール用のアクセス権限

コンソールで作成した Lambda のソースをリポジトリへ取り込むため、エージェントに
Lambda の読み取り権限が必要になった際は、長期的な IAM アクセスキーを発行せず、
スコープを限定した IAM Identity Center の許可セット
（`CodexLambdaExport-889149079837`）を作成しました。ツールに渡されたのはその
許可セットに限定された一時認証情報のみで、永続的な AWS 認証情報は共有していません。
その後、`visitor-counter-emergency-disable` の読み取り権限を許可セットに追加し、
他の 6 つの Lambda 関数とともに、この関数のソースも Git に取り込みました。

### 静的ホスティング

サイトはプライベート S3 バケットをオリジンとする CloudFront から配信しています。
CloudFront のキャッシュは有効なので、キャッシュヒット時はエッジから返され、S3
へのリクエストは発生しません。デプロイ時には `/*` の invalidation を 1 回だけ
作成し、デプロイワークフローはパスでフィルタしているため、ドキュメントのみの
コミットではアップロードと invalidation は実行されません。

### 適用範囲について

上記のスロットリング、アラーム、封じ込め Lambda は、AWS コンソールおよび CLI
から手動で設定したものです。このリポジトリの CloudFormation や Terraform では
定義していません。このポートフォリオにおける Infrastructure as Code の実例は
Secure VPC Foundation プロジェクトです。

## 現在のビルドステータス

完了:

**ポートフォリオサイト**

* Ubuntu VM のセットアップ
* Git / GitHub のワークフロー
* ローカルでのポートフォリオページ作成
* プライベート S3 と CloudFront による静的ホスティング
* 認定バッジの検証リンク
* ルートアカウントの MFA 設定
* IAM 管理ユーザーの設定
* S3 バケット削除ガードレール
* ローカルの Python デプロイスクリプト
* S3 アップロードと CloudFront invalidation の自動化
* GitHub Actions による CI/CD デプロイワークフロー
* 日英バイリンガル対応

**サーバーレス訪問者カウンター**

* API Gateway HTTP API
* Lambda 訪問者カウンター関数
* DynamoDB 訪問者カウンターテーブル
* フッターに表示される訪問者カウンター
* ブラウザから API への CORS 設定
* CloudWatch によるログ出力とトラブルシューティングの確認
* API Gateway のリクエストスロットリング
* 呼び出し回数アラームと自動封じ込め（エンドツーエンドで検証済み）

**セキュアな VPC 基盤**

* パブリック / アプリケーション / データベースサブネットを持つマルチ AZ VPC
* インターネット向け ALB と、Auto Scaling Group 内のプライベート EC2 インスタンス
* パブリックアクセスを無効化したプライベート RDS
* NAT Gateway と S3 ゲートウェイエンドポイント
* CloudFormation による再現
* Terraform による独立した再現
* 検証、証跡の記録、および削除まで完了

**非同期注文処理ワークフロー**

* Publisher / Status / Processor / Notifier Lambda を備えた API Gateway HTTP API
* 冪等性を考慮した DynamoDB の注文レコード
* 処理 / 監査 / 通知キューへの SNS ファンアウト
* 意図的な poison message で検証したデッドレターキュー
* 構築・検証後に公開トラフィックから切り離した SES 確認メールブランチ
* API Gateway のリクエストスロットリング
* 呼び出し回数アラームと自動封じ込め
* ポートフォリオサイト上の公開ライブデモ

予定:

* Route 53とACM証明書によるカスタムドメイン
* ポートフォリオサイト自体のアーキテクチャ図
* 次のプロジェクト: コンテナ / オブザーバビリティラボ

## デプロイワークフロー

通常のデプロイは、現在GitHub Actionsで自動化されています。

現在のデプロイフローは次の通りです。

```text
git push to main
→ GitHub Actions workflow starts
→ GitHub Actions assumes PortfolioDeployRole through OIDC
→ Python deployment script runs
→ website files are uploaded to S3
→ CloudFront invalidation is created
→ live CloudFront site is updated
```

ワークフローファイルの場所は次の通りです。

```text
.github/workflows/deploy.yml
```

Pythonデプロイスクリプトの場所は次の通りです。

```text
tools/deploy.py
```

通常のデプロイでは、AWSコンソールからの手動アップロードは不要です。

通常のデプロイコマンドフローは次の通りです。

```bash
git add .
git commit -m "Update portfolio"
git push
```

push後、GitHub Actionsが自動的にデプロイワークフローを実行します。

## ローカルPythonデプロイテスト

GitHub Actionsへ移行する前に、Pythonデプロイスクリプトをローカルでテストしました。

スクリプトは2つのデプロイ操作を実行します。

```text
1. website/ 内のウェブサイトファイルをプライベートS3バケットへアップロードする
2. /* に対してCloudFront invalidationを作成する
```

スクリプトは`boto3`を使用しており、AWSアクセスキーやシークレット認証情報は含んでいません。

ローカルテストでは、AWS認証情報は次のローカルAWSプロファイルから提供されました。

```text
portfolio-deploy
```

このプロファイルは、ローカルの`portfolio-runner` source profileを使って、次のAWSロールをassumeしました。

```text
PortfolioDeployRole
```

スクリプトはローカルで次のコマンドにより実行しました。

```bash
AWS_PROFILE=portfolio-deploy python tools/deploy.py
```

デプロイは正常に完了しました。

確認された出力:

```text
Files found in website folder:
Uploaded: style.css (text/css)
Uploaded: script.js (application/javascript)
Uploaded: index.html (text/html)
Cache invalidated: IAY301RL9CHESDUIISB7RBYPYM
```

これにより、GitHub Actionsへ移行する前に、ローカルデプロイチェーンが動作することを確認しました。

## GitHub Actions CI/CDデプロイ

現在、GitHub Actionsを自動デプロイに使用しています。

このワークフローは、`main`ブランチに変更がpushされたときに実行されます。リポジトリをチェックアウトし、Pythonをセットアップし、`boto3`をインストールし、一時的なAWS認証情報を設定して、Pythonデプロイスクリプトを実行します。

GitHub ActionsワークフローはOpenID Connect（OIDC）を使用して、次のロールをassumeします。

```text
PortfolioDeployRole
```

GitHubには長期AWSアクセスキーを保存していません。

GitHub Actionsのデプロイチェーンは次の通りです。

```text
GitHub Actions job
→ OIDC identity token
→ AWS STS
→ temporary PortfolioDeployRole credentials
→ boto3
→ S3 upload
→ CloudFront invalidation
```

これにより、以前の手動デプロイワークフローとローカル専用デプロイ手順を置き換えました。

## 自動化の進化

デプロイワークフローは段階的に進化しました。

1. 手動デプロイ
   ファイルをS3へ手動でアップロードし、CloudFront invalidationを手動で作成していました。

2. ローカルPython自動化
   Pythonデプロイスクリプトが、ローカルマシンからサイトファイルをS3へアップロードし、CloudFront invalidationを作成しました。

3. GitHub Actions CI/CD
   同じデプロイロジックが、`main`ブランチへのpush後にGitHub Actionsから自動実行されるようになりました。

この進化は意図的なものです。まず手動プロセスを理解し、その後ローカルで自動化し、最後にCI/CDパターンへ移行しました。

## リポジトリ構成

```text
.github/
└── workflows/
    └── deploy.yml          CI/CD: OIDC role assumption + Python deploy

backend/
└── visitor-counter/
    ├── README.md           エンドポイントの安全対策、封じ込めテスト
    ├── evidence/           封じ込めテストのスクリーンショット
    └── src/                エクスポートした Lambda ソース（カウンター + キルスイッチ）

projects/                   Per-project documentation and source
├── secure-vpc-foundation/
│   ├── readme.md           日本語
│   ├── readme-en.md        English
│   ├── evidence/
│   ├── notes/
│   ├── template/           CloudFormation
│   └── terraform/
└── event-driven-order-processing-workflow/
    ├── readme.md           日本語
    ├── readme-en.md        English
    ├── evidence/
    ├── notes/
    └── src/                Exported Lambda source

tools/
├── deploy.py               boto3: S3 upload + CloudFront invalidation
└── export_lambdas.sh       Pull console-authored Lambdas into Git

website/                    Deployed to S3, served via CloudFront
├── index.html
├── style.css
├── script.js
└── projects/
    ├── secure-vpc-foundation/
    └── event-driven-order-processing-workflow/

readme.md                   日本語 (primary)
readme-en.md                English
```

## 実証したスキル

### クラウドアーキテクチャ

* プライベート S3 をオリジンとする CloudFront の HTTPS 配信
* ホスティング構成の選定: S3 静的ウェブサイトホスティングや Amplify ではなく、プライベート S3 + CloudFront を採用
* パブリック / アプリケーション / データベースの 3 層に分けたマルチ AZ VPC 設計
* インターネット向け Application Load Balancer と、Auto Scaling Group 内のプライベート EC2 インスタンス
* パブリックアクセスを無効化したプライベート Amazon RDS
* プライベートサブネットからの外向き通信用 NAT Gateway と、S3 への非公開アクセス用 S3 ゲートウェイエンドポイント
* API Gateway HTTP API、Lambda、DynamoDB によるサーバーレスバックエンド設計
* イベント駆動アーキテクチャ: SNS から複数の SQS キューへのファンアウトと、独立したコンシューマー
* 非同期処理の状態管理とクライアント側のポーリング

### Infrastructure as Code

* CloudFormation テンプレートの作成とスタックのデプロイ
* ネットワーク、コンピュート、データベース、ロードバランサー、セキュリティごとにファイルを分割した Terraform 構成
* Terraform の plan / apply / destroy ワークフロー、変数、出力、プロバイダーのバージョン固定
* 手動で構築したアーキテクチャを、2 つの IaC ツールで独立して再現

### セキュリティと IAM

* ルートアカウントの MFA による保護
* IAM ユーザー、グループ、ポリシーの設計
* リソース単位にスコープを絞った、Lambda 関数ごとの実行ロール
* 長期的なアクセスキーではなく、IAM ユーザー → AssumeRole → 一時認証情報という構成
* GitHub Actions からの OIDC ベースのロール引き受け
* ツールへ一時的かつ限定的なアクセスを付与するための IAM Identity Center 許可セット
* S3 バケットポリシーによる明示的な Deny ガードレールと、拒否される動作の実地検証
* ロードバランサー / アプリケーション / データベース各層のセキュリティグループ分離
* 訪問者の IP アドレスをソルト付きでハッシュ化し、生の IP は保存しない設計

### 運用と信頼性

* 公開された未認証エンドポイントに対する API Gateway のリクエストスロットリング
* Lambda の呼び出し回数に対する CloudWatch アラーム
* アラーム連動の Lambda による自動封じ込め（予約済み同時実行数を 0 に設定）
* 復旧経路まで含めた、封じ込めのエンドツーエンドテスト
* デッドレターキューの設定と、意図的な poison message による検証
* CloudWatch ログを用いた Lambda / API Gateway のトラブルシューティング
* CloudTrail によるアカウントレベルの API 監査
* コスト管理のためのリソース削除とクリーンアップ
* アカウントレベルのコストガードレールとしての AWS Budgets

### 自動化とデリバリー

* boto3 による Python デプロイ自動化
* パスフィルタと同時実行制御を備えた GitHub Actions の CI/CD
* S3 アップロードと CloudFront invalidation の自動化
* エラー時に誤って成功を報告せず、パイプラインを失敗させるデプロイスクリプト
* コンソールで作成した Lambda のソースをバージョン管理へ取り込む仕組み

### 開発とドキュメント

* Linux ターミナルでの作業
* Git と GitHub によるバージョン管理
* HTML / CSS / JavaScript による静的サイト開発
* クライアントサイドの言語切り替えを備えた日英バイリンガルコンテンツ
* ブラウザから API へのリクエストのための CORS 設定
* 条件付き書き込みとアトミックカウンターを用いた DynamoDB テーブル設計
* 採用しなかった選択肢とその理由を記録した運用ドキュメント

## 認定資格

* AWS Solutions Architect – Associate
  https://www.credly.com/badges/d90a629b-7b16-4c0e-8c84-903acc4397c4/public_url

* AWS Cloud Practitioner
  https://www.credly.com/badges/c3ca8016-c9d7-4f4a-8cd0-62cb293e47a1/public_url

* CompTIA A+
  https://www.credly.com/badges/7d23a7b4-8425-4e25-9cda-e0ec5e36d6e5/public_url

* JLPT N2

## 目的

このリポジトリは、実践的なクラウド運用学習スプリントの一部です。このプロジェクトは、完成した成果物だけでなく、クラウドホスト型システムを構築し、デプロイし、ドキュメント化し、トラブルシューティングし、保護し、改善していくプロセスそのものを示すことを目的としています。
