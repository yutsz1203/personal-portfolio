import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "personal-website",
    name: "Personal Website",
    blurb: "This site.",
    liveUrl: "https://mervinyu.vercel.app/",
    repoUrl: "https://github.com/yutsz1203/personal-portfolio",
    image: {
      src: "/personal-website.webp",
      alt: "Personal Website screenshot",
      width: 1200,
      height: 750,
    },
    tech: ["TypeScript", "Next.js", "React", "Tailwind CSS"],
    featured: true,
  },
  {
    slug: "football-prediction-engine",
    name: "Football Prediction Engine",
    blurb: "Predicting match outcomes of top 5 European leagues utilising historical data and assisted me to finish in the global top 3% of Fantasy Premier League in 6 of 7 seasons.",
    repoUrl: "https://github.com/yutsz1203/football-prediction-engine",
    image: {
      src: "/football-prediction-engine.webp",
      alt: "Football Prediction Engine screenshot",
      width: 1200,
      height: 750,
    },
    tech: ["Python", "pandas", "numpy", "scikit-learn", "statsmodel", "matplotlib"],
    featured: true,
  },
  {
    slug: "robo-advisor",
    name: "Robo-advisor and Portfolio Tracking System",
    blurb: "My Final Year Project. An automated investment advice platform that utilizes data science techniques to provide personalized investment recommendations to users with risk analytics capabilities.",
    liveUrl: "https://portfolio-tracking-system-and-robo-advisor.streamlit.app/",
    repoUrl: "https://github.com/yutsz1203/robo-advisor-and-portfolio-tracking-system",
    image: {
      src: "/robo-advisor.webp",
      alt: "Robo-advisor and Portfolio Tracking System screenshot",
      width: 1200,
      height: 750,
    },
    tech: ["Python", "Streamlit", "quanstats", "pandas", "PyPortfolioOpt"],
    featured: true,
  },
  {
    slug: "horse-racing-model",
    name: "Horse Racing Model",
    blurb: "Developing a multinomial logit model trying to estimate true winning probabilities of horses for gaining an edge over the general public and searching for positive returns at the track.",
    repoUrl: "https://github.com/yutsz1203/horse-racing-model",
    tech: ["Python"],
    featured: false,
  },
  {
    slug: "flight-analytics-dashboard",
    name: "Flight Analytics Dashboard",
    blurb: "Delivered clear visual reporting, pie charts and tables of passenger and cargo arrivals/departures, showing distribution and total flight counts by airline and airport.",
    liveUrl: "https://flight-analytics-dashboard.streamlit.app/",
    repoUrl: "https://github.com/yutsz1203/flight-analytics-dashboard",
    image: {
      src: "/flight-analytics-dashboard.webp",
      alt: "Flight Analytics Dashboard screenshot",
      width: 1200,
      height: 750,
    },
    tech: ["Python", "HK OpenData"],
    featured: false,
  },
  {
    slug: "home-advantage-investigation",
    name: "Home Advantage Investigation",
    blurb: "My first coding project. Investigated the existence of home advantages in football through analysing team performances before and during COVID-19, where no audiences were allowed.",
    repoUrl: "https://github.com/yutsz1203/home-advantage-investigation",
    tech: ["Python", "Jupyter Notebook", "pandas", "matplotlib"],
    featured: false,
  },
];

export const featuredProjects = projects.filter((project) => project.featured);