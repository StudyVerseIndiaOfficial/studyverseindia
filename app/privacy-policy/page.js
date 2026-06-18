export default function PrivacyPolicyPage() {
  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.title}>Privacy Policy</h1>

        <p style={styles.text}>
          Study Verse India अपने उपयोगकर्ताओं की गोपनीयता का सम्मान करता है। यह Privacy
          Policy बताती है कि हमारी website पर आने वाले users की जानकारी, cookies और
          third-party services से संबंधित basic जानकारी कैसे manage की जा सकती है।
        </p>

        <h2 style={styles.subTitle}>Information We Collect</h2>
        <p style={styles.text}>
          Study Verse India सामान्य रूप से users से कोई sensitive personal information collect
          नहीं करता। यदि user हमसे contact करता है, तो email address और message जैसी जानकारी
          केवल सहायता या feedback के उद्देश्य से उपयोग की जा सकती है।
        </p>

        <h2 style={styles.subTitle}>Cookies</h2>
        <p style={styles.text}>
          हमारी website user experience को बेहतर बनाने के लिए cookies का उपयोग कर सकती है।
          Cookies छोटी files होती हैं जो browser में store हो सकती हैं और website experience
          को बेहतर बनाने में सहायता करती हैं।
        </p>

        <h2 style={styles.subTitle}>Google AdSense and Advertising</h2>
        <p style={styles.text}>
          भविष्य में Study Verse India पर Google AdSense या अन्य third-party advertising
          services के माध्यम से विज्ञापन दिखाए जा सकते हैं। Google cookies का उपयोग करके
          users को उनकी रुचि के अनुसार ads दिखा सकता है।
        </p>

        <h2 style={styles.subTitle}>Third-Party Links</h2>
        <p style={styles.text}>
          हमारी website पर कुछ external links, videos या official websites के links दिए जा
          सकते हैं। उन websites की privacy policy और content के लिए Study Verse India
          जिम्मेदार नहीं होगा। Users को external websites का उपयोग करते समय उनकी policies
          पढ़नी चाहिए।
        </p>

        <h2 style={styles.subTitle}>Educational Purpose</h2>
        <p style={styles.text}>
          Study Verse India पर उपलब्ध सभी notes, PDF, videos, tests और information केवल
          educational purpose के लिए हैं। परीक्षा, job, government scheme या official update
          से संबंधित final confirmation के लिए official website जरूर देखें।
        </p>

        <h2 style={styles.subTitle}>Policy Updates</h2>
        <p style={styles.text}>
          Study Verse India समय-समय पर इस Privacy Policy को update कर सकता है। Website का
          उपयोग जारी रखने पर आप updated policy से सहमत माने जाएंगे।
        </p>

        <h2 style={styles.subTitle}>Contact</h2>
        <p style={styles.text}>
          Privacy Policy से संबंधित किसी भी सवाल के लिए आप हमसे संपर्क कर सकते हैं:
        </p>

        <p style={styles.email}>shyamjeer44@gmail.com</p>
      </section>
    </main>
  );
}

const styles = {
  main: {
    minHeight: "100vh",
    padding: "30px 15px",
    background: "#f5f7fb",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    maxWidth: "950px",
    width: "100%",
    background: "#ffffff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
    lineHeight: "1.8",
  },
  title: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#1e3a8a",
    marginBottom: "20px",
  },
  subTitle: {
    fontSize: "23px",
    fontWeight: "800",
    color: "#111827",
    marginTop: "22px",
    marginBottom: "10px",
  },
  text: {
    fontSize: "17px",
    color: "#333",
    marginBottom: "14px",
  },
  email: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#2563eb",
    marginTop: "10px",
  },
};