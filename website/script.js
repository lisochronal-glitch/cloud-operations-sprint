const translations = {
  en: {
    pageTitle: "Sebastian Hoglund | AWS / Cloud Operations Portfolio",

    "hero.eyebrow": "クラウド運用 / AWS Cloud Operations",
    "hero.name": "Sebastian Hoglund",
    "hero.lead": "AWS-certified cloud engineer based in Japan with experience designing, deploying, automating, and troubleshooting cloud infrastructure across AWS, Linux, Terraform, Git/GitHub, and CI/CD.",
    "hero.primaryButton": "View Current Projects",
    "hero.secondaryButton": "Contact / Links",

    "profile.heading": "Technical Profile",
    "profile.cloudLabel": "Cloud Engineering",
    "profile.cloudValue": "AWS infrastructure / networking / serverless",
    "profile.iacLabel": "Infrastructure as Code",
    "profile.iacValue": "Terraform / CloudFormation",
    "profile.opsLabel": "Operations & Delivery",
    "profile.opsValue": "Linux / GitHub Actions / CI/CD / troubleshooting",
    "profile.locationLanguagesLabel": "Location & Languages",
    "profile.locationLanguagesValue": "Japan / Tokyo-Kanto · English / Japanese (JLPT N2) / Swedish",

    "about.label": "PROFILE",
    "about.heading": "Cloud engineering across infrastructure, automation, and operations",
    "about.paragraph1": "I design and build AWS infrastructure across networking, compute, storage, serverless, IAM, databases, monitoring, and event-driven services. My portfolio includes multi-AZ VPC architecture, private EC2 and RDS tiers behind an Application Load Balancer, infrastructure reproduced with CloudFormation and Terraform, serverless APIs, asynchronous SQS/SNS workflows, and automated deployment through GitHub Actions.",
    "about.paragraph2": "I work from Linux, manage infrastructure and application code with Git/GitHub, validate changes before deployment, verify deployed systems through CLI and runtime checks, and troubleshoot configuration and service issues using logs, health information, and infrastructure state. Each project is documented as a complete working system rather than an isolated service exercise.",

    "proof.label": "FEATURED PROOF",
    "proof.heading": "This portfolio site is itself a working AWS cloud project",
    "proof.intro": "This site is hosted on private Amazon S3, delivered through CloudFront, deployed automatically through GitHub Actions, and connected to a serverless visitor counter backend using API Gateway, Lambda, DynamoDB, and CloudWatch.",
    "proof.archHeading": "Live Architecture",
    "proof.staticLabel": "Static site:",
    "proof.staticText": "HTML/CSS/JavaScript stored in a private Amazon S3 bucket",
    "proof.cdnLabel": "CDN:",
    "proof.cdnText": "CloudFront provides public HTTPS delivery and caching",
    "proof.backendLabel": "Backend:",
    "proof.backendText": "API Gateway routes POST /visit requests to a Python Lambda function",
    "proof.databaseLabel": "Database:",
    "proof.databaseText": "DynamoDB stores visitor records and global counter totals",
    "proof.counterLabel": "Visible proof:",
    "proof.counterText": "The footer visitor counter is returned from DynamoDB through the live backend path",
    "proof.automationLabel": "Automation:",
    "proof.automationText": "GitHub Actions deploys site updates and creates CloudFront invalidations",
    "proof.statusHeading": "Implemented Stack",
    "proof.statusHosting": "Private S3 + CloudFront hosting",
    "proof.statusCicd": "GitHub Actions CI/CD with OIDC",
    "proof.statusApi": "API Gateway HTTP API",
    "proof.statusLambda": "Python Lambda backend",
    "proof.statusDynamo": "DynamoDB visitor counter",
    "proof.statusVisible": "Visible footer counter",
    "proof.githubButton": "View project on GitHub",

    "projects.label": "PROJECTS",
    "projects.heading": "Portfolio projects",
    "projects.intro": "These projects are designed to demonstrate cloud operations, infrastructure support, automation, troubleshooting, and documentation through visible working systems.",

    "projects.project2Status": "Completed AWS networking lab",
    "projects.project2Title": "Secure VPC Foundation",
    "projects.project2Text": "Built, verified, and reproduced a secure multi-AZ AWS network for a web application using a public Application Load Balancer, private EC2 application instances, private RDS, Auto Scaling, NAT Gateway, security-group isolation, and an S3 Gateway Endpoint. The architecture was implemented manually and reproduced independently with both CloudFormation and Terraform.",
    "projects.project2ViewProject": "View project ↗",
    "projects.project2Github": "GitHub ↗",

    "projects.project3Status": "Completed AWS event-driven workflow",
    "projects.project3Title": "Asynchronous SaaS Order Processing Workflow",
    "projects.project3Text": "Built a live order-processing workflow using API Gateway, Lambda, SNS, SQS, DynamoDB, Amazon SES, a dead-letter queue, CloudWatch, CloudTrail, and operational safety monitoring. The demo accepts a sample order, processes it asynchronously, tracks status, and includes a confirmation email branch.",
    "projects.project3ViewProject": "View project ↗",
    "projects.project3Github": "GitHub ↗",

    "certs.label": "CERTIFICATIONS",
    "certs.heading": "Credentials",
    "certs.saaTitle": "AWS Solutions Architect – Associate",
    "certs.saaText": "AWS architecture, reliability, security, networking, storage, and service design fundamentals.",
    "certs.cpTitle": "AWS Cloud Practitioner",
    "certs.cpText": "Cloud concepts, AWS core services, pricing, security, and shared responsibility.",
    "certs.aplusTitle": "CompTIA A+",
    "certs.aplusText": "Operating systems, hardware, troubleshooting, networking, and technical support foundations.",
    "certs.n2Title": "JLPT N2",
    "certs.n2Text": "Japanese ability supported by certification and long-term daily Japanese communication experience.",
    "certs.badgeLink": "View verified badge ↗",

    "skills.label": "SKILLS",
    "skills.heading": "Technical capabilities",
    "skills.cloudTitle": "Cloud / AWS",
    "skills.cloudText": "S3, CloudFront, Route 53, API Gateway, Lambda, DynamoDB, IAM, CloudWatch, VPC, subnets, route tables, security groups, ALB, EC2, Auto Scaling, RDS, NAT Gateway, S3 Gateway Endpoint, SNS, SQS, SES",
    "skills.opsTitle": "Operations",
    "skills.opsText": "Linux, AWS CLI, IAM users/roles/policies, least-privilege design, service health verification, logs, deployment validation, troubleshooting",
    "skills.iacTitle": "Infrastructure as Code",
    "skills.iacText": "Terraform, CloudFormation, variables, plan/apply/destroy workflows, state management, provider dependency locking",
    "skills.automationTitle": "Automation / Delivery",
    "skills.automationText": "Git, GitHub, GitHub Actions, OIDC, Python automation, CI/CD, environment variables, repeatable deployments",

    "background.label": "BACKGROUND",
    "background.heading": "Professional background",
    "background.educationTitle": "Education / Communication",
    "background.educationText": "Former high school English teacher with professional experience explaining complex material, identifying misunderstandings, giving structured feedback, adapting explanations to different learners, and communicating clearly with students, colleagues, and guardians.",
    "background.japanTitle": "Japan / Language",
    "background.japanText": "Long-term Japanese study and daily Japanese communication experience, supported by JLPT N2 certification. Currently building stronger professional Japanese for technical and cloud infrastructure environments.",

    "contact.label": "CONTACT",
    "contact.heading": "Links and contact",
    "contact.text": "Open to cloud engineering and cloud operations roles in Japan. Feel free to reach out in English or Japanese.",
    "contact.github": "GitHub",
    "contact.linkedin": "LinkedIn",
    "contact.email": "Email",
    "contact.cv": "CV available on request",

    "project3.pageTitle": "Asynchronous SaaS Order Processing Workflow | AWS Portfolio Project",
    "project3.eyebrow": "AWS EVENT-DRIVEN WORKFLOW PROJECT",
    "project3.title": "Asynchronous SaaS Order Processing Workflow",
    "project3.lead1": "A SaaS company needs to accept customer orders quickly while slower follow-up work, such as confirmation processing, audit logging, status updates, and failure handling, happens reliably in the background.",
    "project3.lead2": "This project demonstrates an event-driven AWS order workflow using API Gateway, Lambda, SNS, SQS, DynamoDB, Amazon SES, CloudWatch, CloudTrail, and a dead-letter queue.",
    "project3.backButton": "Back to Projects",
    "project3.githubButton": "View on GitHub",
    "project3.solutionLabel": "SOLUTION ARCHITECTURE",
    "project3.solutionHeading": "Accept the order immediately, then process it asynchronously",
    "project3.solutionText": "The diagram shows how the live project page submits a demo order to AWS. The request is accepted immediately, published as an event, processed asynchronously, and tracked in DynamoDB. The architecture also includes a verified Amazon SES confirmation-email branch that is disabled for public demo traffic, with CloudWatch monitoring and CloudTrail auditing.",
    "project3.demoButton": "Test order workflow",
    "project3.demoPrompt": "Click the button to create a demo order and watch the asynchronous workflow complete.",
    "project3.demoText": "Run a safe sample order through the live AWS workflow. The page creates an order through API Gateway, then polls the status API until the asynchronous SQS/Lambda processing step updates DynamoDB to completed.",
    "project3.howLabel": "HOW IT WORKS",
    "project3.howHeading": "Event fanout, queue buffering, status tracking, and failure isolation",
    "project3.howText1": "API Gateway receives the order request from the project page and invokes a publisher Lambda. The publisher creates or checks the DynamoDB order record, uses the order ID for idempotency, and publishes the order event to SNS.",
    "project3.howText2": "In the live demo, SNS fans the event out to the processing and audit SQS queues. The processing queue triggers a processor Lambda that performs the background work and updates DynamoDB, while the audit queue keeps an independent copy for inspection and troubleshooting. A separate notification queue and notifier Lambda were also implemented and verified with Amazon SES, then disconnected from public demo traffic to prevent unnecessary email sends.",
    "project3.howText3": "If processing repeatedly fails, the message is moved to a dead-letter queue instead of being lost. CloudWatch provides logs and metrics for runtime behavior, while CloudTrail provides an AWS API audit trail for account-level activity.",
    "project3.evidenceLabel": "IMPLEMENTATION EVIDENCE",
    "project3.evidenceHeading": "Detailed build notes and implementation proof are documented in GitHub",
    "project3.evidenceText": "The repository includes the project README, Lambda source code, build notes, architecture diagram, live-demo completion proof, DynamoDB state evidence, DLQ verification, SES delivery proof, the CloudWatch safety alarm, SNS safety-topic subscriptions, the emergency-disable Lambda, and cleanup notes.",
    "project3.viewProjectGithub": "View project on GitHub",
    "project3.footer": "Powered by Amazon CloudFront",

    "footer.text": "Built as part of a practical AWS / cloud operations portfolio project.",
    "footer.updated": "Last updated:",
    "footer.visits": "Visits:",
    "footer.uniqueVisitors": "Unique visitors:"
  },

  ja: {
    pageTitle: "Sebastian Hoglund | AWS・クラウド運用ポートフォリオ",

    "hero.eyebrow": "クラウド運用 / AWS Cloud Operations",
    "hero.name": "Sebastian Hoglund",
    "hero.lead": "AWS認定資格を持つ、日本在住のクラウドエンジニア。AWS、Linux、Terraform、Git/GitHub、CI/CDを用いたクラウドインフラの設計、構築、自動化、トラブルシューティングに対応します。",
    "hero.primaryButton": "プロジェクトを見る",
    "hero.secondaryButton": "連絡先 / リンク",

    "profile.heading": "技術プロフィール",
    "profile.cloudLabel": "クラウドエンジニアリング",
    "profile.cloudValue": "AWSインフラ / ネットワーク / サーバーレス",
    "profile.iacLabel": "Infrastructure as Code",
    "profile.iacValue": "Terraform / CloudFormation",
    "profile.opsLabel": "運用・デリバリー",
    "profile.opsValue": "Linux / GitHub Actions / CI/CD / トラブルシューティング",
    "profile.locationLanguagesLabel": "拠点・言語",
    "profile.locationLanguagesValue": "日本 / 東京・関東圏 · 英語 / 日本語（JLPT N2）/ スウェーデン語",

    "about.label": "プロフィール",
    "about.heading": "インフラ、自動化、運用を横断するクラウドエンジニアリング",
    "about.paragraph1": "ネットワーク、コンピュート、ストレージ、サーバーレス、IAM、データベース、監視、イベント駆動サービスを含むAWSインフラを設計・構築しています。ポートフォリオには、マルチAZ VPC、Application Load Balancer配下のプライベートEC2/RDS構成、CloudFormationとTerraformによるIaC化、サーバーレスAPI、SQS/SNSを用いた非同期ワークフロー、GitHub Actionsによる自動デプロイを含みます。",
    "about.paragraph2": "Linux環境で作業し、Git/GitHubでインフラおよびアプリケーションコードを管理しています。デプロイ前の変更検証、CLIと実行時確認によるデプロイ後検証、ログ・ヘルス情報・インフラ状態を用いた設定やサービス障害のトラブルシューティングまで実施します。各プロジェクトは単発のサービス演習ではなく、動作するシステムとして構築・検証・文書化しています。",

    "proof.label": "実装済みの証拠",
    "proof.heading": "このポートフォリオサイト自体が、動作するAWSクラウドプロジェクトです",
    "proof.intro": "このサイトは、プライベートAmazon S3でホストし、CloudFrontで配信し、GitHub Actionsで自動デプロイしています。また、API Gateway、Lambda、DynamoDB、CloudWatchを使ったサーバーレス訪問者カウンターのバックエンドにも接続しています。",
    "proof.archHeading": "稼働中の構成",
    "proof.staticLabel": "静的サイト：",
    "proof.staticText": "HTML/CSS/JavaScriptをプライベートAmazon S3バケットに保存",
    "proof.cdnLabel": "CDN：",
    "proof.cdnText": "CloudFrontによる公開HTTPS配信とキャッシュ",
    "proof.backendLabel": "バックエンド：",
    "proof.backendText": "API GatewayがPOST /visitリクエストをPython Lambda関数へルーティング",
    "proof.databaseLabel": "データベース：",
    "proof.databaseText": "DynamoDBに訪問者レコードと全体カウンターを保存",
    "proof.counterLabel": "表示される証拠：",
    "proof.counterText": "フッターの訪問者カウンターは、稼働中のバックエンド経由でDynamoDBから返される値です",
    "proof.automationLabel": "自動化：",
    "proof.automationText": "GitHub Actionsがサイト更新をデプロイし、CloudFront invalidationを作成",
    "proof.statusHeading": "実装済みスタック",
    "proof.statusHosting": "プライベートS3 + CloudFrontホスティング",
    "proof.statusCicd": "GitHub Actions CI/CD（OIDC）",
    "proof.statusApi": "API Gateway HTTP API",
    "proof.statusLambda": "Python Lambdaバックエンド",
    "proof.statusDynamo": "DynamoDB訪問者カウンター",
    "proof.statusVisible": "表示されるフッターカウンター",
    "proof.githubButton": "GitHubでプロジェクトを見る",

    "projects.label": "プロジェクト",
    "projects.heading": "ポートフォリオプロジェクト",
    "projects.intro": "これらのプロジェクトは、動作するシステムを通じて、クラウド運用、インフラサポート、自動化、トラブルシューティング、ドキュメント作成を示すためのものです。",

    "projects.project2Status": "AWSネットワークラボ完了",
    "projects.project2Title": "セキュアなVPC基盤",
    "projects.project2Text": "パブリックApplication Load Balancer、プライベートEC2アプリケーションインスタンス、プライベートRDS、Auto Scaling、NAT Gateway、Security Groupによる分離、S3 Gateway Endpointを備えたWebアプリケーション向けのセキュアなマルチAZ AWSネットワークを構築・検証しました。同一アーキテクチャをAWSコンソールで手動構築した後、CloudFormationとTerraformの両方で独立して再現しました。",
    "projects.project2ViewProject": "プロジェクトを見る ↗",
    "projects.project2Github": "GitHub ↗",

    "projects.project3Status": "AWSイベント駆動ワークフロー完了",
    "projects.project3Title": "非同期SaaS注文処理ワークフロー",
    "projects.project3Text": "API Gateway、Lambda、SNS、SQS、DynamoDB、Amazon SES、dead-letter queue、CloudWatch、CloudTrail、運用上の安全監視を使用して、ライブの注文処理ワークフローを構築しました。デモではサンプル注文を受け付け、非同期で処理し、ステータスを追跡し、確認メールの分岐も含めています。",
    "projects.project3ViewProject": "プロジェクトを見る ↗",
    "projects.project3Github": "GitHub ↗",

    "certs.label": "資格",
    "certs.heading": "保有資格",
    "certs.saaTitle": "AWS Solutions Architect – Associate",
    "certs.saaText": "AWSアーキテクチャ、信頼性、セキュリティ、ネットワーク、ストレージ、サービス設計の基礎。",
    "certs.cpTitle": "AWS Cloud Practitioner",
    "certs.cpText": "クラウドの基本概念、AWS主要サービス、料金、セキュリティ、責任共有モデル。",
    "certs.aplusTitle": "CompTIA A+",
    "certs.aplusText": "OS、ハードウェア、トラブルシューティング、ネットワーク、テクニカルサポートの基礎。",
    "certs.n2Title": "JLPT N2",
    "certs.n2Text": "資格と長期的な日常日本語コミュニケーション経験に基づく日本語力。",
    "certs.badgeLink": "認定バッジを見る ↗",

    "skills.label": "スキル",
    "skills.heading": "技術能力",
    "skills.cloudTitle": "クラウド / AWS",
    "skills.cloudText": "S3、CloudFront、Route 53、API Gateway、Lambda、DynamoDB、IAM、CloudWatch、VPC、サブネット、ルートテーブル、セキュリティグループ、ALB、EC2、Auto Scaling、RDS、NAT Gateway、S3 Gateway Endpoint、SNS、SQS、SES",
    "skills.opsTitle": "運用",
    "skills.opsText": "Linux、AWS CLI、IAMユーザー/ロール/ポリシー、最小権限設計、サービスヘルス確認、ログ、デプロイ検証、トラブルシューティング",
    "skills.iacTitle": "Infrastructure as Code",
    "skills.iacText": "Terraform、CloudFormation、変数管理、plan/apply/destroy、state管理、provider依存関係の固定",
    "skills.automationTitle": "自動化 / デリバリー",
    "skills.automationText": "Git、GitHub、GitHub Actions、OIDC、Python自動化、CI/CD、環境変数、反復可能なデプロイ",

    "background.label": "経歴",
    "background.heading": "職務・学習背景",
    "background.educationTitle": "教育 / コミュニケーション",
    "background.educationText": "元高校英語教員として、複雑な内容の説明、理解不足の特定、構造的なフィードバック、相手に合わせた説明、学生・同僚・保護者との明確なコミュニケーションに携わってきました。",
    "background.japanTitle": "日本 / 言語",
    "background.japanText": "長期的な日本語学習と日常的な日本語コミュニケーション経験があり、JLPT N2を取得しています。現在は、技術・クラウドインフラ環境で使える専門的な日本語力をさらに伸ばしています。",

    "contact.label": "連絡先",
    "contact.heading": "リンクと連絡先",
    "contact.text": "日本国内のクラウドエンジニア / クラウド運用ポジションを探しています。日本語・英語どちらでもご連絡ください。",
    "contact.github": "GitHub",
    "contact.linkedin": "LinkedIn",
    "contact.email": "メール",
    "contact.cv": "履歴書・職務経歴書はご依頼に応じて送付",

    "project3.pageTitle": "非同期SaaS注文処理ワークフロー | AWSポートフォリオプロジェクト",
    "project3.eyebrow": "AWSイベント駆動ワークフロープロジェクト",
    "project3.title": "非同期SaaS注文処理ワークフロー",
    "project3.lead1": "SaaS企業では、顧客注文をすばやく受け付けながら、確認処理、監査ログ、ステータス更新、障害対応などの後続処理をバックグラウンドで確実に実行する必要があります。",
    "project3.lead2": "このプロジェクトでは、API Gateway、Lambda、SNS、SQS、DynamoDB、Amazon SES、CloudWatch、CloudTrail、デッドレターキューを使用したイベント駆動型のAWS注文処理ワークフローを示しています。",
    "project3.backButton": "プロジェクト一覧に戻る",
    "project3.githubButton": "GitHubで見る",
    "project3.solutionLabel": "ソリューション構成",
    "project3.solutionHeading": "注文をすぐに受け付け、その後非同期で処理する",
    "project3.solutionText": "この図は、ライブプロジェクトページからデモ注文をAWSへ送信する流れを示しています。リクエストはすぐに受け付けられ、イベントとして発行され、非同期で処理され、DynamoDBで追跡されます。また、Amazon SESを使用した確認メール分岐も実装・検証済みですが、公開デモのトラフィックでは無効化しています。CloudWatchで監視し、CloudTrailで監査します。",
    "project3.demoButton": "注文処理を試す",
    "project3.demoPrompt": "ボタンを押すとデモ注文が作成され、非同期ワークフローが完了するまでの流れを確認できます。",
    "project3.demoText": "安全なサンプル注文を稼働中のAWSワークフローに送信します。ページはAPI Gateway経由で注文を作成し、SQS/Lambdaによる非同期処理がDynamoDBのステータスを完了に更新するまでステータスAPIをポーリングします。",
    "project3.howLabel": "仕組み",
    "project3.howHeading": "イベント分配、キューバッファリング、ステータス追跡、障害分離",
    "project3.howText1": "API Gatewayがプロジェクトページから注文リクエストを受け取り、Publisher Lambdaを呼び出します。PublisherはDynamoDBの注文レコードを作成または確認し、注文IDを使って冪等性を確保したうえで、注文イベントをSNSに発行します。",
    "project3.howText2": "公開デモでは、SNSがイベントを処理用SQSキューと監査用SQSキューへファンアウトします。処理キューはProcessor Lambdaを起動してバックグラウンド処理を実行し、DynamoDBを更新します。監査キューには、確認やトラブルシューティングに使用できる独立したイベントコピーが保存されます。通知用キューとNotifier LambdaもAmazon SESで実装・検証しましたが、不要なメール送信を防ぐため、公開デモのトラフィックからは切り離しています。",
    "project3.howText3": "処理が繰り返し失敗した場合、メッセージは失われずにデッドレターキューへ移動されます。CloudWatchは実行時のログとメトリクスを提供し、CloudTrailはアカウントレベルのAWS API操作履歴を提供します。",
    "project3.evidenceLabel": "実装証拠",
    "project3.evidenceHeading": "詳細な構築メモと実装証拠はGitHubに記録",
    "project3.evidenceText": "リポジトリには、プロジェクトREADME、Lambdaソースコード、構築メモ、アーキテクチャ図、ライブデモ完了の証跡、DynamoDB状態、DLQ検証、SES配信証跡、CloudWatch安全アラーム、SNS安全通知トピックのサブスクリプション、緊急停止Lambda、クリーンアップメモを掲載しています。",
    "project3.viewProjectGithub": "GitHubでプロジェクトを見る",
    "project3.footer": "Amazon CloudFrontで配信",

    "footer.text": "実践的なAWS / クラウド運用ポートフォリオプロジェクトとして作成。",
    "footer.updated": "最終更新：",
    "footer.visits": "訪問数：",
    "footer.uniqueVisitors": "ユニーク訪問者："
  }
};

const VISIT_API_URL = "https://i3vjsl5oil.execute-api.ap-northeast-1.amazonaws.com/visit";

const updatedElement = document.getElementById("last-updated");
const languageButtons = document.querySelectorAll(".lang-button");
const translatableElements = document.querySelectorAll("[data-i18n]");
const totalVisitsElement = document.getElementById("total-visits");
const uniqueVisitorsElement = document.getElementById("unique-visitors");

function getInitialLanguage() {
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

function renderDate(language) {
  if (!updatedElement) {
    return;
  }

  const today = new Date();
  const locale = language === "ja" ? "ja-JP" : "en-GB";

  updatedElement.textContent = today.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function applyLanguage(language) {
  const dictionary = translations[language];

  translatableElements.forEach((element) => {
    const key = element.dataset.i18n;

    if (dictionary[key]) {
      element.textContent = dictionary[key];
    }
  });

  document.documentElement.lang = language;
  const pageTitleKey = document.body.dataset.pageTitleKey;
  document.title = pageTitleKey && dictionary[pageTitleKey] ? dictionary[pageTitleKey] : dictionary.pageTitle;

  languageButtons.forEach((button) => {
    const isActive = button.dataset.lang === language;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  localStorage.setItem("preferredLanguage", language);
  renderDate(language);
}

async function recordVisit() {
  try {
    const response = await fetch(VISIT_API_URL, {
      method: "POST"
    });

    if (!response.ok) {
      throw new Error(`Visit API returned ${response.status}`);
    }

    const data = await response.json();

    if (totalVisitsElement) {
      totalVisitsElement.textContent = data.total_visits;
    }

    if (uniqueVisitorsElement) {
      uniqueVisitorsElement.textContent = data.unique_visitors;
    }

    console.log("Visit recorded:", data);
  } catch (error) {
    console.error("Visit counter failed:", error);
  }
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyLanguage(button.dataset.lang);
  });
});

applyLanguage(getInitialLanguage());
recordVisit();

console.log("Cloud Operations portfolio loaded.");
