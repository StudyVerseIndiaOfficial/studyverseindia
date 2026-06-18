export default function ContactPage() {
  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.title}>Contact Us</h1>

        <p style={styles.text}>
          यदि आपको Study Verse India वेबसाइट से संबंधित किसी प्रकार की समस्या, सुझाव,
          feedback या अध्ययन सामग्री से जुड़ी सहायता चाहिए, तो आप हमसे संपर्क कर सकते हैं।
        </p>

        <p style={styles.text}>
          हम छात्रों के लिए website को लगातार बेहतर बनाने का प्रयास कर रहे हैं। आपका सुझाव
          हमारे लिए महत्वपूर्ण है।
        </p>

        <div style={styles.box}>
          <h2 style={styles.subTitle}>Email</h2>
          <p style={styles.email}>shyamjeer44@gmail.com</p>
        </div>

        <p style={styles.text}>
          हम आपके संदेश का उत्तर यथासंभव शीघ्र देने का प्रयास करेंगे।
        </p>

        <p style={styles.note}>
          कृपया ध्यान दें: यह website केवल educational purpose के लिए बनाई गई है।
        </p>
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
    maxWidth: "900px",
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
    fontSize: "22px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "8px",
  },
  text: {
    fontSize: "18px",
    color: "#333",
    marginBottom: "16px",
  },
  box: {
    background: "#eef4ff",
    padding: "18px",
    borderRadius: "12px",
    margin: "20px 0",
    border: "1px solid #c7d2fe",
  },
  email: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#2563eb",
  },
  note: {
    fontSize: "16px",
    color: "#666",
    marginTop: "20px",
  },
};