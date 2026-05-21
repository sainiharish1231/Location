import Link from "next/link";
import { LocationCapture } from "./components/location-capture";
import { RiMenu3Fill } from "react-icons/ri";

// const stats = [
//   // { value: "Full Stack", label: "Software Development" },
//   { value: "Next.js", label: "Portfolio stack" },
//   { value: "Nawalgarh", label: "Birol, Rajasthan" },
// ];

const featureCards = [
  {
    title: "Animated Portfolio",
    label: "Personal brand",
    text: "A modern purple portfolio with smooth motion, clean cards, and real photos.",
  },
  {
    title: "Mobile First UI",
    label: "Responsive design",
    text: "Every section is designed first for mobile, then polished for desktop.",
  },
  {
    title: "Next.js Projects",
    label: "Frontend build",
    text: "Fast pages, reusable components, and clean project presentation.",
  },
  {
    title: "Visitor Check-in",
    label: " flow",
    text: "A welcome popup opens first, then shows  data after permission.",
  },
];

const skills = [
  "Next.js",
  "React",
  "JavaScript",
  "Tailwind UI",
  "HTML",
  "CSS",
  "Responsive Design",
  "Frontend Projects",
];

const projects = [
  {
    title: "Personal Portfolio",
    type: "Next.js Website",
    result:
      "A purple animated portfolio with real photos, smooth cards, and mobile responsive sections.",
  },
  {
    title: "College Project UI",
    type: "Frontend Practice",
    result:
      "Clean student dashboard layouts for academic submissions and frontend practice.",
  },
  {
    title: " History Web",
    type: "Next.js App",
    result:
      "A visitor check-in flow with  result cards and an admin history dashboard.",
  },
];

const education = [
  {
    year: "Now",
    title: "Seth G.B. Podar College",
    detail:
      "Studying Bca Software Development with a focus on web, frontend, and practical projects.",
  },
  {
    year: "Stack",
    title: "Next.js Developer",
    detail:
      "Building modern websites using React, Next.js, responsive CSS, and UI design.",
  },
  {
    year: "Base",
    title: "Birol, Nawalgarh",
    detail:
      "Learning, building, and improving through practical portfolio projects.",
  },
];

const achievements = [
  "Created a personal Next.js portfolio with animated purple UI.",
  "Practicing mobile-first responsive layouts and clean section design.",
  "Building frontend projects for college work and portfolio presentation.",
];

const gallery = [
  {
    src: "/harish-hero.jpeg",
    alt: "Saini Harish standing in front of a lit building",
  },
  {
    src: "/harish-campus-selfie.jpeg",
    alt: "Saini Harish selfie in an indoor lit hall",
  },
  {
    src: "/harish-night-portrait.jpeg",
    alt: "Saini Harish night portrait",
  },
];

export default function Home() {
  return (
    <main className="portfolioShell">
      <nav className="topbar" aria-label="Main navigation">
        <Link className="brand" href="/">
          Saini Harish
        </Link>
        <div className="navItems">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Contact</a>
          {/* <Link className="adminLink" href="/history">
            Admin
          </Link> */}
        </div>
        <details className="mobileMenu">
          <summary aria-label="Open mobile menu">
            <RiMenu3Fill />
          </summary>
          <div className="mobileMenuPanel">
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#skills">Skills</a>
            <a href="#gallery">Gallery</a>
            <a href="#contact">Contact</a>
            {/* <Link href="/history">Admin</Link> */}
          </div>
        </details>
      </nav>
      <LocationCapture />

      <section className="portfolioHero">
        <div className="heroCopy">
          <p className="eyebrow">Bca Software Development</p>
          <h1>Saini Harish</h1>
          <p>
            Student at Seth G.B. Podar College. I build modern Next.js websites
            with animated purple UI, sharp portfolio cards, and mobile-first
            responsive layouts.
          </p>
          <div className="heroActions">
            <a className="primaryButton linkButton" href="#projects">
              View projects
            </a>
            <a className="secondaryButton linkButton" href="#contact">
              Contact me
            </a>
          </div>
          <div className="heroStats" aria-label="Portfolio highlights">
            {/* {stats.map((stat) => (
              <span key={stat.label}>
                <strong>{stat.value}</strong>
                {stat.label}
              </span>
            ))} */}
          </div>
        </div>

        <div className="heroVisual" aria-label="Saini Harish portfolio preview">
          <img
            alt="Saini Harish in front of a lit campus style building"
            src="/harish-hero.jpeg"
          />
          <div className="visualCard">
            <span>Portfolio focus</span>
            <strong>Next.js developer from Birol, Nawalgarh.</strong>
          </div>
          <div className="floatingBadge one">Next.js</div>
          <div className="floatingBadge two">Tailwind UI</div>
          <div className="floatingBadge three">Purple Theme</div>
        </div>
      </section>

      <section className="featureBand" aria-label="Portfolio features">
        <div className="featureGrid">
          {featureCards.map((card, index) => (
            <article
              className={`featureCard revealBlock delay${(index % 3) + 1}`}
              key={card.title}
            >
              <span>{card.label}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="aboutBand" id="about">
        <div className="sectionHeader revealBlock">
          <p className="eyebrow">About</p>
          <h2>A college student building practical web projects.</h2>
        </div>
        <div className="aboutGrid">
          <article className="aboutPanel revealBlock">
            <span>Profile</span>
            <p>
              I am Saini Harish, a Bca Software Development student at Seth G.B.
              Podar College. I like creating clean web interfaces, animated
              sections, and practical frontend projects.
            </p>
          </article>
          <article className="aboutPanel revealBlock delayOne">
            <span>Goal</span>
            <p>
              My focus is Next.js development, responsive UI, Tailwind-style
              layouts, and portfolio websites that feel polished on every
              screen.
            </p>
          </article>
        </div>
      </section>

      <section className="sectionBand" id="projects">
        <div className="sectionHeader revealBlock">
          <p className="eyebrow">Projects</p>
          <h2>Project work made for college and career growth.</h2>
        </div>
        <div className="projectGrid">
          {projects.map((project, index) => (
            <article
              className={`projectCard revealBlock delay${index + 1}`}
              key={project.title}
            >
              <span>{project.type}</span>
              <h3>{project.title}</h3>
              <p>{project.result}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="timelineBand" id="education">
        <div className="sectionHeader revealBlock">
          <p className="eyebrow">Education</p>
          <h2>From college learning to frontend development.</h2>
        </div>
        <div className="timeline">
          {education.map((item, index) => (
            <article
              className={`timelineItem revealBlock delay${index + 1}`}
              key={item.title}
            >
              <span>{item.year}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="sectionBand skillBand" id="skills">
        <div className="sectionHeader revealBlock">
          <p className="eyebrow">Skills</p>
          <h2>Skills used to build responsive portfolio UI.</h2>
        </div>
        <div className="skillCloud" aria-label="Skills">
          {skills.map((skill, index) => (
            <span className={`revealBlock delay${(index % 3) + 1}`} key={skill}>
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="galleryBand" id="gallery">
        <div className="sectionHeader revealBlock">
          <p className="eyebrow">Gallery</p>
          <h2>Personal gallery for an authentic portfolio feel.</h2>
        </div>
        <div className="photoGrid">
          {gallery.map((photo, index) => (
            <figure
              className={`photoCard revealBlock delay${index + 1}`}
              key={photo.src}
            >
              <img alt={photo.alt} src={photo.src} />
            </figure>
          ))}
        </div>
      </section>

      <section className="achievementBand">
        <div className="sectionHeader revealBlock">
          <p className="eyebrow">Highlights</p>
          <h2>Clean, sharp, and ready to share on mobile.</h2>
        </div>
        <div className="achievementList">
          {achievements.map((achievement, index) => (
            <article
              className={`achievementItem revealBlock delay${index + 1}`}
              key={achievement}
            >
              <span>0{index + 1}</span>
              <p>{achievement}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contactBand" id="contact">
        <div>
          <p className="eyebrow">Contact</p>
          <h2>Open for college projects and frontend work.</h2>
          <p>
            Based around Birol, Nawalgarh, and focused on Next.js, responsive
            design, and polished animated web portfolios.
          </p>
        </div>
        <a className="primaryButton linkButton" href="mailto:hello@example.com">
          Email now
        </a>
      </section>
    </main>
  );
}
