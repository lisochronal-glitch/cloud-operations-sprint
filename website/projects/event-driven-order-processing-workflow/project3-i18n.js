const project3Translations = {
  en: {
    pageTitle: "Asynchronous SaaS Order Processing Workflow | AWS Portfolio Project"
  },
  ja: {
    pageTitle: "非同期SaaS注文処理ワークフロー | AWSポートフォリオプロジェクト",

    "AWS EVENT-DRIVEN WORKFLOW PROJECT": "AWSイベント駆動ワークフロープロジェクト",
    "Asynchronous SaaS Order Processing Workflow": "非同期SaaS注文処理ワークフロー",

    "A SaaS company needs to accept customer orders quickly while slower follow-up work, such as confirmation processing, audit logging, status updates, and failure handling, happens reliably in the background.":
    "SaaS企業では、顧客注文をすばやく受け付けながら、確認処理、監査ログ、ステータス更新、障害対応などの時間がかかる後続処理をバックグラウンドで確実に実行する必要があります。",

    "This project demonstrates an event-driven AWS order workflow using API Gateway, Lambda, SNS, SQS, DynamoDB, Amazon SES, CloudWatch, CloudTrail, and a dead-letter queue.":
    "このプロジェクトでは、API Gateway、Lambda、SNS、SQS、DynamoDB、Amazon SES、CloudWatch、CloudTrail、デッドレターキューを使用したイベント駆動型のAWS注文処理ワークフローを示しています。",

    "Back to Projects": "プロジェクト一覧に戻る",
    "View on GitHub": "GitHubで見る",

    "SOLUTION ARCHITECTURE": "ソリューション構成",
    "Accept the order immediately, then process it asynchronously": "注文をすぐに受け付け、その後非同期で処理する",

    "The diagram shows how a live project page can submit a demo order into an AWS workflow. The request is accepted quickly, published as an event, processed in the background, tracked in DynamoDB, sent through a confirmation email branch using Amazon SES, and monitored through CloudWatch and CloudTrail.":
    "この図は、稼働中のプロジェクトページからデモ注文をAWSワークフローへ送信する流れを示しています。リクエストはすばやく受け付けられ、イベントとして発行され、バックグラウンドで処理され、DynamoDBでステータス管理され、Amazon SESを使った確認メール分岐を通り、CloudWatchとCloudTrailで監視・監査されます。",

    "Test order workflow": "注文ワークフローをテスト",

    "Click the button to create a demo order and watch the asynchronous workflow complete.":
    "ボタンを押すとデモ注文が作成され、非同期ワークフローが完了するまでの流れを確認できます。",

    "Run a safe sample order through the live AWS workflow. The page creates an order through API Gateway, then polls the status API until the asynchronous SQS/Lambda processing step updates DynamoDB to completed.":
    "安全なサンプル注文を稼働中のAWSワークフローに送信します。ページはAPI Gateway経由で注文を作成し、SQS/Lambdaによる非同期処理がDynamoDBのステータスを完了に更新するまでステータスAPIをポーリングします。",

    "HOW IT WORKS": "仕組み",
    "Event fanout, queue buffering, status tracking, and failure isolation": "イベント分配、キューバッファリング、ステータス追跡、障害分離",

    "API Gateway receives the order request from the project page and invokes a publisher Lambda. The publisher creates or checks the DynamoDB order record, uses the order ID for idempotency, and publishes the order event to SNS.":
    "API Gatewayがプロジェクトページから注文リクエストを受け取り、Publisher Lambdaを呼び出します。PublisherはDynamoDBの注文レコードを作成または確認し、注文IDを使って冪等性を確保したうえで、注文イベントをSNSに発行します。",

    "SNS fans the event out to three SQS queues: a processing queue, an audit queue, and a notification queue. The processing queue triggers a processor Lambda that performs the background order work and updates the order status in DynamoDB. The audit queue keeps an independent copy of the event for inspection and troubleshooting. The notification queue triggers a notification Lambda that sends a customer confirmation email through Amazon SES.":
    "SNSはイベントを3つのSQSキューに分配します。処理キューはProcessor Lambdaを起動し、バックグラウンドの注文処理を行ってDynamoDBの注文ステータスを更新します。監査キューは、確認やトラブルシューティング用にイベントの独立したコピーを保持します。通知キューはNotification Lambdaを起動し、Amazon SESを通じて顧客確認メールを送信します。",

    "If processing repeatedly fails, the message is moved to a dead-letter queue instead of being lost. CloudWatch provides logs and metrics for runtime behavior, while CloudTrail provides an AWS API audit trail for account-level activity.":
    "処理が繰り返し失敗した場合、メッセージは失われずにデッドレターキューへ移動されます。CloudWatchは実行時のログとメトリクスを提供し、CloudTrailはアカウントレベルのAWS API操作履歴を提供します。",

    "IMPLEMENTATION EVIDENCE": "実装証拠",
    "Detailed build notes and implementation proof are documented in GitHub": "詳細な構築メモと実装証拠はGitHubに記録",

    "The repository documents the project README, Lambda source code, manual build notes, architecture evidence, CloudWatch and CloudTrail screenshots, DLQ verification, SES notification proof, operational safety notes, and cleanup notes.":
    "リポジトリには、プロジェクトREADME、Lambdaソースコード、手動構築メモ、構成証拠、CloudWatchとCloudTrailのスクリーンショット、DLQ検証、SES通知の証拠、運用上の安全対策、クリーンアップメモを記録しています。",

    "View project on GitHub": "GitHubでプロジェクトを見る",
    "Powered by Amazon CloudFront": "Amazon CloudFrontで配信"
  }
};

const project3LanguageButtons = document.querySelectorAll(".project-detail-language-switch .lang-button");

function normalizeProject3Text(value) {
  return value.replace(/\s+/g, " ").trim();
}

function getProject3InitialLanguage() {
  const savedLanguage = localStorage.getItem("preferredLanguage");

  if (savedLanguage === "en" || savedLanguage === "ja") {
    return savedLanguage;
  }

  const browserLanguage = navigator.language || navigator.userLanguage || "";

  if (browserLanguage.toLowerCase().startsWith("ja")) {
    return "ja";
  }

  return "en";
}

function applyProject3Language(language) {
  const jaTranslations = project3Translations.ja;

  document.querySelectorAll("p, h1, h2, a, button, span").forEach((element) => {
    if (element.closest(".project-detail-language-switch")) {
      return;
    }

    if (!element.dataset.project3English) {
      const normalizedText = normalizeProject3Text(element.textContent);

      if (jaTranslations[normalizedText]) {
        element.dataset.project3English = normalizedText;
      }
    }

    const englishText = element.dataset.project3English;

    if (!englishText) {
      return;
    }

    element.textContent = language === "ja" ? jaTranslations[englishText] : englishText;
  });

  document.documentElement.lang = language;
  document.title = language === "ja" ? project3Translations.ja.pageTitle : project3Translations.en.pageTitle;

  project3LanguageButtons.forEach((button) => {
    const isActive = button.dataset.lang === language;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  localStorage.setItem("preferredLanguage", language);
}

project3LanguageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyProject3Language(button.dataset.lang);
  });
});

applyProject3Language(getProject3InitialLanguage());
