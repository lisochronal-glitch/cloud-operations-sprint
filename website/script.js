const translations = {
  en: {
    pageTitle: "Sebastian Hoglund | AWS / Cloud Operations Portfolio",

    "hero.eyebrow": "クラウド運用 / AWS Cloud Operations",
    "hero.name": "Sebastian Hoglund",
    "hero.lead": "AWS-certified cloud operations candidate in Japan combining technical support fundamentals, bilingual communication ability, and hands-on deployment practice across Linux, Git/GitHub, AWS services, documentation, and troubleshooting.",
    "hero.primaryButton": "View Current Projects",
    "hero.secondaryButton": "Contact / Links",

    "profile.heading": "Profile Summary",
    "profile.targetLabel": "Target",
    "profile.targetValue": "Junior Cloud Operations / IT Infrastructure / Technical Support",
    "profile.locationLabel": "Location",
    "profile.locationValue": "Japan / Tokyo-Kanto area",
    "profile.languagesLabel": "Languages",
    "profile.languagesValue": "English, Japanese, Swedish",
    "profile.japaneseLabel": "Japanese",
    "profile.japaneseValue": "JLPT N2 / Daily Japanese communication",

    "about.label": "PROFILE",
    "about.heading": "AWS-certified junior cloud operations candidate focused on infrastructure support and deployment workflows",
    "about.paragraph1": "I bring AWS certification, CompTIA technical support fundamentals, Japanese-English communication ability, and a professional background in structured explanation and problem diagnosis. This portfolio demonstrates practical cloud operations work through Linux, Git/GitHub, AWS hosting and deployment workflows, documentation, troubleshooting, and controlled project iteration.",
    "about.paragraph2": "My focus is not only on knowing cloud concepts, but on using them in job-shaped workflows: working in Linux, managing code with Git/GitHub, deploying small systems, reading logs, documenting failures, and improving systems through structured troubleshooting.",

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
    "proof.statusCicd": "GitHub Actions CI/CD deployment",
    "proof.statusApi": "API Gateway HTTP API",
    "proof.statusLambda": "Python Lambda backend",
    "proof.statusDynamo": "DynamoDB visitor counter",
    "proof.statusVisible": "Visible footer counter",
    "proof.githubButton": "View project on GitHub",

    "projects.label": "PROJECTS",
    "projects.heading": "Portfolio projects",
    "projects.intro": "These projects are designed to demonstrate cloud operations, infrastructure support, automation, troubleshooting, and documentation through visible working systems.",
    "projects.project1Status": "Completed",
    "projects.project1Title": "Cloud Operations Portfolio",
    "projects.project1Text": "A live AWS-hosted portfolio site using private S3, CloudFront, GitHub Actions deployment, API Gateway, Lambda, DynamoDB, CORS, and a visible footer visitor counter.",
    "projects.project1Link": "View repository ↗",

    "projects.project2Status": "Completed AWS networking lab",
    "projects.project2Text": "Built, verified, and reproduced a secure AWS network for a small web application using a public Application Load Balancer, private EC2 application instances, private RDS configuration, route tables, security groups, Auto Scaling, NAT Gateway, S3 Gateway Endpoint, and CloudFormation.",
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

    "project.label": "CURRENT PROJECT",
    "project.heading": "Cloud Operations Portfolio",
    "project.intro": "This site is the visible front end of a practical cloud operations project. The static site is hosted on private Amazon S3, delivered through CloudFront, and deployed automatically through GitHub Actions running a Python deployment script. It also includes a serverless visitor counter backend using API Gateway, Lambda, DynamoDB, and CloudWatch, with live totals displayed in the footer.",
    "project.archHeading": "Current Architecture",
    "project.staticLabel": "Static site:",
    "project.staticText": "HTML/CSS/JavaScript stored in a private Amazon S3 bucket",
    "project.cdnLabel": "CDN:",
    "project.cdnText": "CloudFront distribution providing public HTTPS delivery and caching",
    "project.backendLabel": "Backend:",
    "project.backendText": "API Gateway triggering a Python Lambda function",
    "project.databaseLabel": "Database:",
    "project.databaseText": "DynamoDB visitor records and global counter totals",
    "project.logsLabel": "Observability:",
    "project.logsText": "CloudWatch logs used for debugging and verification",
    "project.automationLabel": "Automation:",
    "project.automationText": "GitHub Actions deployment pipeline",

    "status.heading": "Build Status",
    "status.vm": "Ubuntu VM setup",
    "status.git": "Git/GitHub workflow",
    "status.localSite": "Local portfolio page",
    "status.awsHosting": "Static AWS hosting",
    "status.cicd": "GitHub Actions CI/CD deployment",
    "status.backend": "Serverless backend",
    "status.visitorCounter": "Visible visitor counter",

    "skills.label": "SKILLS",
    "skills.heading": "Operational skills developed through practical work",
    "skills.cloudTitle": "Cloud / AWS",
    "skills.cloudText": "S3, CloudFront, Route 53, API Gateway, Lambda, DynamoDB, IAM, CloudWatch, VPC, subnets, route tables, security groups, ALB, EC2, Auto Scaling, RDS, NAT Gateway, S3 Gateway Endpoint, CloudFormation, SNS, SQS",
    "skills.opsTitle": "Operations",
    "skills.opsText": "Linux terminal workflow, package management, file structure, logs, troubleshooting",
    "skills.workflowTitle": "Development Workflow",
    "skills.workflowText": "Git, GitHub, commits, repository structure, README documentation, controlled changes",
    "skills.automationTitle": "Automation",
    "skills.automationText": "GitHub Actions, deployment workflows, environment variables, repeatable releases",

    "evidence.label": "WORK STYLE",
    "evidence.heading": "What this portfolio is designed to demonstrate",
    "evidence.item1": "Ability to turn theory into visible, working systems",
    "evidence.item2": "Ability to document errors, fixes, and lessons learned",
    "evidence.item3": "Ability to explain technical decisions clearly and practically",
    "evidence.item4": "Ability to work carefully inside real operational workflows",
    "evidence.item5": "Ability to build evidence through Git history, README quality, and project documentation",

    "background.label": "BACKGROUND",
    "background.heading": "Professional background",
    "background.educationTitle": "Education / Communication",
    "background.educationText": "Former high school English teacher with professional experience explaining complex material, identifying misunderstandings, giving structured feedback, adapting explanations to different learners, and communicating clearly with students, colleagues, and guardians.",
    "background.japanTitle": "Japan / Language",
    "background.japanText": "Long-term Japanese study and daily Japanese communication experience, supported by JLPT N2 certification. Currently building stronger professional Japanese for technical and cloud infrastructure environments.",

    "contact.label": "CONTACT",
    "contact.heading": "Links and contact",
    "contact.text": "This section will include the live GitHub repository, deployed AWS site, LinkedIn profile, and downloadable CV once the project is ready for external review.",
    "contact.github": "GitHub",
    "contact.linkedin": "LinkedIn / Placeholder",
    "contact.cv": "CV available on request",

    "footer.text": "Built as part of a practical AWS / cloud operations portfolio project.",
    "footer.updated": "Last updated:",
    "footer.visits": "Visits:",
    "footer.uniqueVisitors": "Unique visitors:"
  },

  ja: {
    pageTitle: "Sebastian Hoglund | AWS・クラウド運用ポートフォリオ",

    "hero.eyebrow": "クラウド運用 / AWS Cloud Operations",
    "hero.name": "Sebastian Hoglund",
    "hero.lead": "日本在住のAWS認定クラウド運用志望者です。テクニカルサポートの基礎、日本語・英語でのコミュニケーション力、Linux、Git/GitHub、AWSサービス、ドキュメント作成、トラブルシューティングを含む実践的なデプロイ経験を組み合わせて、クラウド運用・インフラサポート領域での実務力を高めています。",
    "hero.primaryButton": "プロジェクトを見る",
    "hero.secondaryButton": "連絡先 / リンク",

    "profile.heading": "プロフィール概要",
    "profile.targetLabel": "志望領域",
    "profile.targetValue": "ジュニアクラウド運用 / ITインフラ / テクニカルサポート",
    "profile.locationLabel": "所在地",
    "profile.locationValue": "日本 / 東京・関東エリア",
    "profile.languagesLabel": "言語",
    "profile.languagesValue": "英語、日本語、スウェーデン語",
    "profile.japaneseLabel": "日本語",
    "profile.japaneseValue": "JLPT N2 / 日常的な日本語コミュニケーション",

    "about.label": "プロフィール",
    "about.heading": "インフラサポートとデプロイ業務に重点を置く、AWS認定ジュニアクラウド運用志望者",
    "about.paragraph1": "AWS認定資格、CompTIA A+で学んだテクニカルサポートの基礎、日本語・英語でのコミュニケーション力、そして構造的な説明・問題診断の経験を活かしています。このポートフォリオでは、Linux、Git/GitHub、AWSホスティングとデプロイの流れ、ドキュメント作成、トラブルシューティング、継続的な改善を通じて、実践的なクラウド運用作業を示しています。",
    "about.paragraph2": "クラウドの概念を知識として理解するだけでなく、実務に近い流れで使うことを重視しています。Linuxで作業し、Git/GitHubでコードを管理し、小さなシステムをデプロイし、ログを読み、失敗と修正内容を記録しながら、構造的なトラブルシューティングを通じて改善していきます。",

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
    "proof.statusCicd": "GitHub Actions CI/CDデプロイ",
    "proof.statusApi": "API Gateway HTTP API",
    "proof.statusLambda": "Python Lambdaバックエンド",
    "proof.statusDynamo": "DynamoDB訪問者カウンター",
    "proof.statusVisible": "表示されるフッターカウンター",
    "proof.githubButton": "GitHubでプロジェクトを見る",

    "projects.label": "プロジェクト",
    "projects.heading": "ポートフォリオプロジェクト",
    "projects.intro": "これらのプロジェクトは、動作するシステムを通じて、クラウド運用、インフラサポート、自動化、トラブルシューティング、ドキュメント作成を示すためのものです。",
    "projects.project1Status": "完了",
    "projects.project1Title": "クラウド運用ポートフォリオ",
    "projects.project1Text": "プライベートS3、CloudFront、GitHub Actionsデプロイ、API Gateway、Lambda、DynamoDB、CORS、表示されるフッター訪問者カウンターを使用した、AWS上で稼働するポートフォリオサイト。",
    "projects.project1Link": "リポジトリを見る ↗",

    "projects.project2Status": "AWSネットワークラボ完了",
    "projects.project2Text": "小規模Webアプリケーション向けに、パブリックApplication Load Balancer、プライベートEC2アプリケーションインスタンス、プライベートRDS構成、ルートテーブル、セキュリティグループ、Auto Scaling、NAT Gateway、S3 Gateway Endpoint、CloudFormationを使用した安全なAWSネットワークを構築・検証・再現しました。",
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

    "project.label": "現在のプロジェクト",
    "project.heading": "クラウド運用ポートフォリオ",
    "project.intro": "このサイトは、実践的なクラウド運用プロジェクトのフロントエンドです。静的サイトはプライベートAmazon S3でホストし、CloudFrontで配信しています。デプロイはGitHub ActionsからPythonデプロイスクリプトを実行して自動化しています。また、API Gateway、Lambda、DynamoDB、CloudWatchを使ったサーバーレス訪問者カウンターのバックエンドを実装し、フッターに訪問数を表示しています。",
    "project.archHeading": "現在の構成",
    "project.staticLabel": "静的サイト：",
    "project.staticText": "Amazon S3でホストするHTML/CSS/JavaScript",
    "project.cdnLabel": "CDN：",
    "project.cdnText": "安全なグローバル配信のためのCloudFrontディストリビューション",
    "project.backendLabel": "バックエンド：",
    "project.backendText": "API GatewayからPython Lambda関数を実行",
    "project.databaseLabel": "データベース：",
    "project.databaseText": "DynamoDBによる訪問者レコードと全体カウンター",
    "project.logsLabel": "監視・確認：",
    "project.logsText": "デバッグと検証に使用するCloudWatch Logs",
    "project.automationLabel": "自動化：",
    "project.automationText": "GitHub Actionsによるデプロイパイプライン",

    "status.heading": "進捗状況",
    "status.vm": "Ubuntu VMセットアップ",
    "status.git": "Git/GitHubワークフロー",
    "status.localSite": "ローカルポートフォリオページ",
    "status.awsHosting": "AWS静的ホスティング",
    "status.cicd": "GitHub Actions CI/CDデプロイ",
    "status.backend": "サーバーレスバックエンド",
    "status.visitorCounter": "表示される訪問者カウンター",

    "skills.label": "スキル",
    "skills.heading": "実践を通じて伸ばしている運用スキル",
    "skills.cloudTitle": "クラウド / AWS",
    "skills.cloudText": "S3、CloudFront、Route 53、API Gateway、Lambda、DynamoDB、IAM、CloudWatch、VPC、サブネット、ルートテーブル、セキュリティグループ、ALB、EC2、Auto Scaling、RDS、NAT Gateway、S3 Gateway Endpoint、CloudFormation、SNS、SQS",
    "skills.opsTitle": "運用",
    "skills.opsText": "Linuxターミナル操作、パッケージ管理、ファイル構成、ログ、トラブルシューティング",
    "skills.workflowTitle": "開発ワークフロー",
    "skills.workflowText": "Git、GitHub、コミット、リポジトリ構成、READMEドキュメント、管理された変更",
    "skills.automationTitle": "自動化",
    "skills.automationText": "GitHub Actions、デプロイワークフロー、環境変数、再現可能なリリース",

    "evidence.label": "このポートフォリオで示したいこと",
    "evidence.heading": "このプロジェクトで示したいこと",
    "evidence.item1": "理論を、目に見える動くシステムに落とし込む力",
    "evidence.item2": "エラー、修正、学んだことを記録する力",
    "evidence.item3": "技術的な判断を明確かつ実践的に説明する力",
    "evidence.item4": "実際の運用フローに近い形で慎重に作業する力",
    "evidence.item5": "Git履歴、README品質、プロジェクト文書を通じて実力を示す力",

    "background.label": "経歴",
    "background.heading": "職務・学習背景",
    "background.educationTitle": "教育 / コミュニケーション",
    "background.educationText": "元高校英語教員として、複雑な内容の説明、理解不足の特定、構造的なフィードバック、相手に合わせた説明、学生・同僚・保護者との明確なコミュニケーションに携わってきました。",
    "background.japanTitle": "日本 / 言語",
    "background.japanText": "長期的な日本語学習と日常的な日本語コミュニケーション経験があり、JLPT N2を取得しています。現在は、技術・クラウドインフラ環境で使える専門的な日本語力をさらに伸ばしています。",

    "contact.label": "連絡先",
    "contact.heading": "リンクと連絡先",
    "contact.text": "このセクションには、外部レビューに出せる段階になった時点で、GitHubリポジトリ、デプロイ済みのAWSサイト、LinkedInプロフィール、ダウンロード可能なCVを掲載します。",
    "contact.github": "GitHub",
    "contact.linkedin": "LinkedIn / 準備中",
    "contact.cv": "履歴書・職務経歴書は依頼に応じて共有",

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
  document.title = dictionary.pageTitle;

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
