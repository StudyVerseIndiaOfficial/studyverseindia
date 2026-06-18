export default function AboutPage() {
  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <h1 style={styles.title}>About Study Verse India</h1>

        <p style={styles.text}>
          Study Verse India एक educational learning platform है, जिसका उद्देश्य छात्रों को
          Notes, PDF, Videos, Practice Tests, Latest Information और Government News
          एक ही स्थान पर उपलब्ध कराना है।
        </p>

        <p style={styles.text}>
          हम विशेष रूप से प्रतियोगी परीक्षाओं, बिहार संबंधित अध्ययन सामग्री तथा सामान्य
          अध्ययन विषयों को सरल भाषा में प्रस्तुत करने का प्रयास करते हैं।
        </p>

        <p style={styles.text}>
          हमारा लक्ष्य छात्रों को गुणवत्तापूर्ण, आसान भाषा में और आसानी से उपलब्ध अध्ययन
          सामग्री प्रदान करना है ताकि विद्यार्थी अपनी तैयारी को बेहतर बना सकें।
        </p>

        <p style={styles.text}>
          Study Verse India पर उपलब्ध सामग्री केवल शैक्षणिक और जानकारी के उद्देश्य से
          प्रदान की जाती है। छात्रों को सलाह दी जाती है कि वे परीक्षा से संबंधित आधिकारिक
          जानकारी के लिए संबंधित official website को भी जरूर देखें।
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
  text: {
    fontSize: "18px",
    color: "#333",
    marginBottom: "16px",
  },
};