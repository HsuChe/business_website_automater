// Create sample website template
const sampleTemplate = await prisma.websiteTemplate.create({
  data: {
    name: 'Modern Business',
    description: 'A clean and modern business website template',
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{companyName}} - {{tagline}}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header>
    <nav>
      <div class="logo">{{companyName}}</div>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section id="home" class="hero">
      <h1>{{companyName}}</h1>
      <p>{{tagline}}</p>
      <a href="#contact" class="cta-button">Get Started</a>
    </section>

    <section id="about" class="about">
      <h2>About Us</h2>
      <p>{{about}}</p>
    </section>

    <section id="services" class="services">
      <h2>Our Services</h2>
      <div class="service-grid">
        {{#each services}}
        <div class="service-card">
          <h3>{{this.name}}</h3>
          <p>{{this.description}}</p>
        </div>
        {{/each}}
      </div>
    </section>

    <section id="contact" class="contact">
      <h2>Contact Us</h2>
      <form>
        <input type="text" placeholder="Name" required>
        <input type="email" placeholder="Email" required>
        <textarea placeholder="Message" required></textarea>
        <button type="submit">Send Message</button>
      </form>
    </section>
  </main>

  <footer>
    <p>&copy; {{currentYear}} {{companyName}}. All rights reserved.</p>
  </footer>
</body>
</html>
    `,
    css: `
:root {
  --primary-color: #2563eb;
  --secondary-color: #1e40af;
  --text-color: #1f2937;
  --background-color: #ffffff;
  --accent-color: #dbeafe;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: var(--text-color);
}

header {
  background-color: var(--background-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 5%;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

nav ul {
  display: flex;
  list-style: none;
  gap: 2rem;
}

nav a {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  transition: color 0.3s ease;
}

nav a:hover {
  color: var(--primary-color);
}

main {
  margin-top: 4rem;
}

section {
  padding: 4rem 5%;
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: 6rem 5%;
  background-color: var(--accent-color);
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.hero p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2rem;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.cta-button:hover {
  background-color: var(--secondary-color);
}

h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: var(--primary-color);
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.service-card {
  padding: 2rem;
  background-color: var(--accent-color);
  border-radius: 0.5rem;
  transition: transform 0.3s ease;
}

.service-card:hover {
  transform: translateY(-5px);
}

.service-card h3 {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

input, textarea {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
}

textarea {
  min-height: 150px;
  resize: vertical;
}

button {
  padding: 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: var(--secondary-color);
}

footer {
  text-align: center;
  padding: 2rem;
  background-color: var(--accent-color);
  margin-top: 4rem;
}

@media (max-width: 768px) {
  nav {
    flex-direction: column;
    gap: 1rem;
  }

  nav ul {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .hero h1 {
    font-size: 2rem;
  }

  .hero p {
    font-size: 1rem;
  }
}
    `,
    thumbnail: 'https://via.placeholder.com/300x200',
    category: 'business',
  },
}); 