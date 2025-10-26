'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipos para el contexto de traducción
export type Language = {
  code: string;
  name: string;
  flag: string;
};

export type TranslationContextType = {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  translate: (text: string) => string;
  translateAsync: (text: string) => Promise<string>;
  languages: Language[];
  isTranslating: boolean;
};

// Idiomas disponibles
export const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇲🇽' },
];

// Traducciones estáticas para textos comunes
const staticTranslations: Record<string, Record<string, string>> = {
  en: {
    'Development & Consulting': 'Development & Consulting',
    'About': 'About',
    'Services': 'Services',
    'Dashboard': 'Dashboard',
    'Research': 'Research',
    'Library': 'Library',
    'Contact': 'Contact',
    'Home': 'Home',
    'Analytics': 'Analytics',
    'Projects': 'Projects',
    'Quick Links': 'Quick Links',
    'Connect With Us': 'Connect With Us',
    'Follow us on social media for updates and news': 'Follow us on social media for updates and news',
    'Privacy Policy': 'Privacy Policy',
    'Terms of Service': 'Terms of Service',
    'All rights reserved': 'All rights reserved',
    'Mission': 'Mission',
    'Vision': 'Vision',
    'Values': 'Values',
    'Our Solutions': 'Our Solutions',
    'Why Choose Us': 'Why Choose Us',
    'Ready to transform your digital infrastructure?': 'Ready to transform your digital infrastructure?',
    'Contact Us': 'Contact Us',
    'Request Consultation': 'Request Consultation',
    'Send Message': 'Send Message',
    'Sending…': 'Sending…',
    'Message sent — we will contact you shortly.': 'Message sent — we will contact you shortly.',
    'Opened mail client as a fallback.': 'Opened mail client as a fallback.',
    'Or reach us directly:': 'Or reach us directly:',
    'Name': 'Name',
    'Email': 'Email',
    'Organization': 'Organization',
    'Message': 'Message',
    'Your full name': 'Your full name',
    'you@company.com': 'you@company.com',
    'Company or institution': 'Company or institution',
    'Tell us briefly about your project or needs': 'Tell us briefly about your project or needs',
    'Please enter your name.': 'Please enter your name.',
    'Please enter your email.': 'Please enter your email.',
    'Please enter a valid email.': 'Please enter a valid email.',
    'Please enter a message.': 'Please enter a message.',
    'Fill the form and we will get back to you within 1-2 business days.': 'Fill the form and we will get back to you within 1-2 business days.',
    'optional': 'optional',
    'Download Resume': 'Download Resume',
    'Specialization': 'Specialization',
    'Key Experience': 'Key Experience',
    'Empowering the future through innovative solutions. We transform ideas into reality, creating meaningful impact in the digital world.': 'Empowering the future through innovative solutions. We transform ideas into reality, creating meaningful impact in the digital world.',
    'Innova Proyectos': 'Innova Proyectos',
    'We are a company specialized in designing and developing scalable digital infrastructures for educational institutions, research centers and organizations seeking to transform their technology footprint.': 'We are a company specialized in designing and developing scalable digital infrastructures for educational institutions, research centers and organizations seeking to transform their technology footprint.',
    'To accelerate digital transformation through robust, secure and high-performance technology solutions that support the strategic goals of our clients.': 'To accelerate digital transformation through robust, secure and high-performance technology solutions that support the strategic goals of our clients.',
    'To be the trusted technology partner in Latin America for organizations seeking world-class digital solutions meeting international standards.': 'To be the trusted technology partner in Latin America for organizations seeking world-class digital solutions meeting international standards.',
    'Innovation, technical excellence, transparent execution, commitment to security and focus on measurable outcomes.': 'Innovation, technical excellence, transparent execution, commitment to security and focus on measurable outcomes.',
    'Technology leader with extensive experience designing and delivering scalable digital infrastructures. Focused on delivering high-impact solutions for educational and enterprise clients.': 'Technology leader with extensive experience designing and delivering scalable digital infrastructures. Focused on delivering high-impact solutions for educational and enterprise clients.',
    'Distributed systems architecture and resilient design': 'Distributed systems architecture and resilient design',
    'Technical leadership and management of multidisciplinary teams': 'Technical leadership and management of multidisciplinary teams',
    'Implementation of AI and Machine Learning solutions': 'Implementation of AI and Machine Learning solutions',
    'Cybersecurity strategies and secure-by-design systems': 'Cybersecurity strategies and secure-by-design systems',
    'Extensive experience delivering high-performance platforms, collaborating with international teams and ensuring projects follow best practices in scalability, availability and security. Proven track record defining technical roadmaps and driving cross-functional delivery.': 'Extensive experience delivering high-performance platforms, collaborating with international teams and ensuring projects follow best practices in scalability, availability and security. Proven track record defining technical roadmaps and driving cross-functional delivery.',
    'We build high-performance technology platforms using agile methodologies and international standards. Our approach incorporates cutting-edge technologies such as Artificial Intelligence, Machine Learning and Cybersecurity.': 'We build high-performance technology platforms using agile methodologies and international standards. Our approach incorporates cutting-edge technologies such as Artificial Intelligence, Machine Learning and Cybersecurity.',
    'Educational Platforms': 'Educational Platforms',
    'Online learning systems (LMS), academic management platforms and collaborative tools designed for educational institutions of all levels.': 'Online learning systems (LMS), academic management platforms and collaborative tools designed for educational institutions of all levels.',
    'Web & Mobile Applications': 'Web & Mobile Applications',
    'Full-stack development of responsive web applications and native or hybrid mobile apps with optimized user experiences and scalable architectures.': 'Full-stack development of responsive web applications and native or hybrid mobile apps with optimized user experiences and scalable architectures.',
    'Publishing Platforms': 'Publishing Platforms',
    'Editorial management systems, institutional repositories, OJS platforms for academic journals and digital publishing solutions for scholarly content.': 'Editorial management systems, institutional repositories, OJS platforms for academic journals and digital publishing solutions for scholarly content.',
    'AI & Cybersecurity': 'AI & Cybersecurity',
    'Implementation of Machine Learning workflows, model deployment and MLOps, secure-by-design systems, threat modeling and risk mitigation strategies.': 'Implementation of Machine Learning workflows, model deployment and MLOps, secure-by-design systems, threat modeling and risk mitigation strategies.',
    'Proven Experience': 'Proven Experience',
    'Successful track record delivering high-performance platforms for educational and research institutions, collaborating with international teams.': 'Successful track record delivering high-performance platforms for educational and research institutions, collaborating with international teams.',
    'Cutting-edge Technology': 'Cutting-edge Technology',
    'We use industry-leading technologies, including modern frameworks, cloud architectures and AI-based solutions.': 'We use industry-leading technologies, including modern frameworks, cloud architectures and AI-based solutions.',
    'Multidisciplinary Teams': 'Multidisciplinary Teams',
    'Technical leadership and mentorship of specialized teams, coordinating development, design, QA and operations professionals.': 'Technical leadership and mentorship of specialized teams, coordinating development, design, QA and operations professionals.',
    'Scalable Architectures': 'Scalable Architectures',
    'We design resilient distributed systems that grow with your organization, ensuring high availability and optimal performance.': 'We design resilient distributed systems that grow with your organization, ensuring high availability and optimal performance.',
    'Comprehensive Security': 'Comprehensive Security',
    'We implement security strategies from day one, with threat modeling and best practices to safeguard critical information.': 'We implement security strategies from day one, with threat modeling and best practices to safeguard critical information.',
    'Agile Methodologies': 'Agile Methodologies',
    'We apply agile frameworks that ensure transparency, iterative deliveries and fast adaptation to change.': 'We apply agile frameworks that ensure transparency, iterative deliveries and fast adaptation to change.',
    'Let\'s discuss how we can help you achieve your technology goals with robust, scalable and secure solutions designed specifically for your organization.': 'Let\'s discuss how we can help you achieve your technology goals with robust, scalable and secure solutions designed specifically for your organization.',
    'Learn More': 'Learn More',
    'Transform Your Digital Presence': 'Transform Your Digital Presence',
    'Web Development': 'Web Development',
    'Build stunning, high-performance websites that engage users and drive results. Our expert team delivers cutting-edge solutions tailored to your business needs.': 'Build stunning, high-performance websites that engage users and drive results. Our expert team delivers cutting-edge solutions tailored to your business needs.',
    'Featured Project': 'Featured Project',
    'Innovative Mobile Solutions': 'Innovative Mobile Solutions',
    'Mobile Development': 'Mobile Development',
    'Create seamless mobile experiences that users love. Native iOS and Android apps built with modern frameworks for optimal performance.': 'Create seamless mobile experiences that users love. Native iOS and Android apps built with modern frameworks for optimal performance.',
    'New Service': 'New Service',
    'Scale Your Business with Cloud': 'Scale Your Business with Cloud',
    'Cloud Infrastructure': 'Cloud Infrastructure',
    'Leverage powerful cloud solutions to scale efficiently. Enterprise-grade infrastructure, security, and reliability for your growing business.': 'Leverage powerful cloud solutions to scale efficiently. Enterprise-grade infrastructure, security, and reliability for your growing business.',
    'Popular Choice': 'Popular Choice',
    'Data-Driven Insights': 'Data-Driven Insights',
    'Data Analytics': 'Data Analytics',
    'Unlock the power of your data with advanced analytics and visualization. Make informed decisions that drive growth and innovation.': 'Unlock the power of your data with advanced analytics and visualization. Make informed decisions that drive growth and innovation.',
    'Top Rated': 'Top Rated',
    'Seamless User Experiences': 'Seamless User Experiences',
    'UI/UX Design': 'UI/UX Design',
    'Craft intuitive and engaging user experiences that drive satisfaction and loyalty. Our design team focuses on user-centered solutions.': 'Craft intuitive and engaging user experiences that drive satisfaction and loyalty. Our design team focuses on user-centered solutions.',
    'Client Favorite': 'Client Favorite',
    'Robust E-commerce Platforms': 'Robust E-commerce Platforms',
    'E-commerce Solutions': 'E-commerce Solutions',
    'Develop scalable e-commerce platforms that enhance customer experience and boost sales. Integrated solutions for all your online business needs.': 'Develop scalable e-commerce platforms that enhance customer experience and boost sales. Integrated solutions for all your online business needs.',
    'Best Seller': 'Best Seller',
    'Advanced Cybersecurity Measures': 'Advanced Cybersecurity Measures',
    'Cybersecurity Services': 'Cybersecurity Services',
    'Protect your digital assets with state-of-the-art cybersecurity solutions. Comprehensive strategies to safeguard against evolving threats.': 'Protect your digital assets with state-of-the-art cybersecurity solutions. Comprehensive strategies to safeguard against evolving threats.',
    'Secure Choice': 'Secure Choice',
    'Efficient IT Consulting': 'Efficient IT Consulting',
    'IT Consulting Services': 'IT Consulting Services',
    'Optimize your IT infrastructure with expert consulting services. Tailored strategies to enhance efficiency, reduce costs, and drive innovation.': 'Optimize your IT infrastructure with expert consulting services. Tailored strategies to enhance efficiency, reduce costs, and drive innovation.',
    'Trusted Advisor': 'Trusted Advisor',
    'Cutting-Edge AI Solutions': 'Cutting-Edge AI Solutions',
    'Artificial Intelligence': 'Artificial Intelligence',
    'Implement AI-driven solutions to automate processes and gain competitive advantages. From machine learning to natural language processing, we cover it all.': 'Implement AI-driven solutions to automate processes and gain competitive advantages. From machine learning to natural language processing, we cover it all.',
    'Innovative Tech': 'Innovative Tech',
    'Comprehensive Digital Marketing': 'Comprehensive Digital Marketing',
    'Digital Marketing Services': 'Digital Marketing Services',
    'Boost your online presence with targeted digital marketing strategies. SEO, SEM, social media, and content marketing to drive traffic and conversions.': 'Boost your online presence with targeted digital marketing strategies. SEO, SEM, social media, and content marketing to drive traffic and conversions.',
    'Marketing Expert': 'Marketing Expert',
    'Innovative IoT Solutions': 'Innovative IoT Solutions',
    'Internet of Things': 'Internet of Things',
    'Connect and manage devices with our IoT solutions. From smart homes to industrial applications, we provide end-to-end IoT services.': 'Connect and manage devices with our IoT solutions. From smart homes to industrial applications, we provide end-to-end IoT services.',
    'Next-Gen Blockchain Development': 'Next-Gen Blockchain Development',
    'Blockchain Solutions': 'Blockchain Solutions',
    'Leverage blockchain technology for secure and transparent transactions. Custom blockchain development for various industries and applications.': 'Leverage blockchain technology for secure and transparent transactions. Custom blockchain development for various industries and applications.',
    'Cutting Edge': 'Cutting Edge',
    'Immersive AR/VR Experiences': 'Immersive AR/VR Experiences',
    'Augmented & Virtual Reality': 'Augmented & Virtual Reality',
    'Create engaging AR and VR experiences that captivate users. From gaming to training simulations, we bring your ideas to life with immersive technology.': 'Create engaging AR and VR experiences that captivate users. From gaming to training simulations, we bring your ideas to life with immersive technology.',
    'Efficient Robotic Process Automation': 'Efficient Robotic Process Automation',
    'RPA Solutions': 'RPA Solutions',
    'Automate repetitive tasks with our RPA solutions. Increase efficiency and reduce errors with intelligent automation tailored to your business processes.': 'Automate repetitive tasks with our RPA solutions. Increase efficiency and reduce errors with intelligent automation tailored to your business processes.',
    'Productivity Boost': 'Productivity Boost',
    'Comprehensive Software Testing': 'Comprehensive Software Testing',
    'QA & Testing Services': 'QA & Testing Services',
    'Ensure the quality and reliability of your software with our comprehensive testing services. Manual and automated testing tailored to your project needs.': 'Ensure the quality and reliability of your software with our comprehensive testing services. Manual and automated testing tailored to your project needs.',
    'Quality First': 'Quality First',
    'Seamless System Integration': 'Seamless System Integration',
    'Integration Services': 'Integration Services',
    'Integrate disparate systems and applications for seamless data flow and improved efficiency. Customized integration solutions to meet your business needs.': 'Integrate disparate systems and applications for seamless data flow and improved efficiency. Customized integration solutions to meet your business needs.',
    'Connected Solutions': 'Connected Solutions',
    'Cutting-Edge Quantum Computing': 'Cutting-Edge Quantum Computing',
    'Quantum Solutions': 'Quantum Solutions',
    'Explore the potential of quantum computing with our innovative solutions. From research to application, we help you harness the power of quantum technology.': 'Explore the potential of quantum computing with our innovative solutions. From research to application, we help you harness the power of quantum technology.',
    'Future Ready': 'Future Ready',
    'Advanced Geographic Information Systems': 'Advanced Geographic Information Systems',
    'GIS Solutions': 'GIS Solutions',
    'Utilize GIS technology for spatial data analysis and visualization. Customized GIS solutions for various industries and applications.': 'Utilize GIS technology for spatial data analysis and visualization. Customized GIS solutions for various industries and applications.',
    'Spatial Expert': 'Spatial Expert',
    'Welcome to': 'Welcome to',
    'Discover the future of innovation with our cutting-edge platform. Start your journey today.': 'Discover the future of innovation with our cutting-edge platform. Start your journey today.',
    'Get Started': 'Get Started',
    'Search research papers, projects, or topics...': 'Search research papers, projects, or topics...',
    'Popular searches:': 'Popular searches:',
    'Machine Learning': 'Machine Learning',
    'AI Research': 'AI Research',
    'Data Science': 'Data Science',
    'Neuroscience': 'Neuroscience',
    'Hello from Next.js!': 'Hello from Next.js!',
    'Research Dashboard': 'Research Dashboard',
    'Welcome back! Here\'s your research overview.': 'Welcome back! Here\'s your research overview.',
    'Total Papers': 'Total Papers',
    'Active Projects': 'Active Projects',
    'Collaborations': 'Collaborations',
    'This Month': 'This Month',
    'Recent Papers': 'Recent Papers',
    'View All': 'View All',
    'No papers added yet': 'No papers added yet',
    'Add your first paper': 'Add your first paper',
    'Manage': 'Manage',
    'No projects yet': 'No projects yet',
    'Create your first project': 'Create your first project',
    'Quick Actions': 'Quick Actions',
    'Add New Paper': 'Add New Paper',
    'Create Project': 'Create Project',
    'Search Library': 'Search Library',
    'Research Library': 'Research Library',
    'Your personal collection of scientific papers': 'Your personal collection of scientific papers',
    'Unread': 'Unread',
    'Read': 'Read',
    'Tags': 'Tags',
    'Search papers...': 'Search papers...',
    'All Tags': 'All Tags',
    'Sort by Date': 'Sort by Date',
    'Sort by Title': 'Sort by Title',
    'Sort by Citations': 'Sort by Citations',
    'No papers found': 'No papers found',
    'Try adjusting your filters': 'Try adjusting your filters',
    'Add your first paper to get started': 'Add your first paper to get started',
    'Add Papers': 'Add Papers',
    'Research Manager': 'Research Manager',
    'Manage your research papers and projects': 'Manage your research papers and projects',
    'Search papers and projects...': 'Search papers and projects...',
    'Search APIs': 'Search APIs',
    'Searching...': 'Searching...',
    'Add Paper': 'Add Paper',
    'Add Project': 'Add Project',
    'Search Results from CrossRef': 'Search Results from CrossRef',
    'Add to Library': 'Add to Library',
    'Search by DOI': 'Search by DOI',
    'Enter DOI (e.g., 10.1038/nature12373)': 'Enter DOI (e.g., 10.1038/nature12373)',
    'Search': 'Search',
    'Search by Title': 'Search by Title',
    'Enter paper title': 'Enter paper title',
    'Search Results': 'Search Results',
    'Title': 'Title',
    'Authors': 'Authors',
    'Enter authors separated by commas': 'Enter authors separated by commas',
    'Abstract': 'Abstract',
    'Journal': 'Journal',
    'Publication Date': 'Publication Date',
    'Enter tags separated by commas': 'Enter tags separated by commas',
    'Adding...': 'Adding...',
    'Cancel': 'Cancel',
    // Auth translations
    'Sign In': 'Sign In',
    'Sign Up': 'Sign Up',
    'Sign Out': 'Sign Out',
    'Profile': 'Profile',
    'Loading...': 'Loading...',
    'Welcome Back': 'Welcome Back',
    'Sign in to your research account': 'Sign in to your research account',
    'Email Address': 'Email Address',
    'Enter your email': 'Enter your email',
    'Password': 'Password',
    'Enter your password': 'Enter your password',
    'Signing In...': 'Signing In...',
    "Don't have an account?": "Don't have an account?",
    'Sign up': 'Sign up',
    'Create Account': 'Create Account',
    'Join our research community': 'Join our research community',
    'Full Name': 'Full Name',
    'Enter your full name': 'Enter your full name',
    'Affiliation': 'Affiliation',
    'University, Institution, Company': 'University, Institution, Company',
    'Research Interests': 'Research Interests',
    'AI, Machine Learning, Data Science (separated by commas)': 'AI, Machine Learning, Data Science (separated by commas)',
    'Create a password': 'Create a password',
    'Confirm Password': 'Confirm Password',
    'Confirm your password': 'Confirm your password',
    'Creating Account...': 'Creating Account...',
    'Already have an account?': 'Already have an account?',
    'Sign in': 'Sign in',
    'Edit Profile': 'Edit Profile',
    'Save': 'Save',
    'Saving...': 'Saving...',
    'Not specified': 'Not specified',
    'No interests specified': 'No interests specified',
    'Authentication Required': 'Authentication Required',
    'Please sign in to access this page': 'Please sign in to access this page',
    'Redirecting to login...': 'Redirecting to login...',
  },
  es: {
    'Development & Consulting': 'Desarrollo y Consultoría',
    'About': 'Acerca de',
    'Services': 'Servicios',
    'Dashboard': 'Panel',
    'Research': 'Investigación',
    'Library': 'Biblioteca',
    'Contact': 'Contacto',
    'Home': 'Inicio',
    'Analytics': 'Analíticas',
    'Projects': 'Proyectos',
    'Quick Links': 'Enlaces Rápidos',
    'Connect With Us': 'Conéctate Con Nosotros',
    'Follow us on social media for updates and news': 'Síguenos en redes sociales para actualizaciones y noticias',
    'Privacy Policy': 'Política de Privacidad',
    'Terms of Service': 'Términos de Servicio',
    'All rights reserved': 'Todos los derechos reservados',
    'Mission': 'Misión',
    'Vision': 'Visión',
    'Values': 'Valores',
    'Our Solutions': 'Nuestras Soluciones',
    'Why Choose Us': 'Por Qué Elegirnos',
    'Ready to transform your digital infrastructure?': '¿Listo para transformar tu infraestructura digital?',
    'Contact Us': 'Contáctanos',
    'Request Consultation': 'Solicitar Consulta',
    'Send Message': 'Enviar Mensaje',
    'Sending…': 'Enviando…',
    'Message sent — we will contact you shortly.': 'Mensaje enviado — te contactaremos pronto.',
    'Opened mail client as a fallback.': 'Se abrió el cliente de correo como respaldo.',
    'Or reach us directly:': 'O contáctanos directamente:',
    'Name': 'Nombre',
    'Email': 'Correo Electrónico',
    'Organization': 'Organización',
    'Message': 'Mensaje',
    'Your full name': 'Tu nombre completo',
    'you@company.com': 'tu@empresa.com',
    'Company or institution': 'Empresa o institución',
    'Tell us briefly about your project or needs': 'Cuéntanos brevemente sobre tu proyecto o necesidades',
    'Please enter your name.': 'Por favor ingresa tu nombre.',
    'Please enter your email.': 'Por favor ingresa tu correo electrónico.',
    'Please enter a valid email.': 'Por favor ingresa un correo electrónico válido.',
    'Please enter a message.': 'Por favor ingresa un mensaje.',
    'Fill the form and we will get back to you within 1-2 business days.': 'Completa el formulario y te responderemos en 1-2 días hábiles.',
    'optional': 'opcional',
    'Download Resume': 'Descargar Currículum',
    'Specialization': 'Especialización',
    'Key Experience': 'Experiencia Clave',
    'Empowering the future through innovative solutions. We transform ideas into reality, creating meaningful impact in the digital world.': 'Impulsando el futuro a través de soluciones innovadoras. Transformamos ideas en realidad, creando un impacto significativo en el mundo digital.',
    'Innova Proyectos': 'Innova Proyectos',
    'We are a company specialized in designing and developing scalable digital infrastructures for educational institutions, research centers and organizations seeking to transform their technology footprint.': 'Somos una empresa especializada en diseñar y desarrollar infraestructuras digitales escalables para instituciones educativas, centros de investigación y organizaciones que buscan transformar su huella tecnológica.',
    'To accelerate digital transformation through robust, secure and high-performance technology solutions that support the strategic goals of our clients.': 'Acelerar la transformación digital a través de soluciones tecnológicas robustas, seguras y de alto rendimiento que apoyen los objetivos estratégicos de nuestros clientes.',
    'To be the trusted technology partner in Latin America for organizations seeking world-class digital solutions meeting international standards.': 'Ser el socio tecnológico de confianza en América Latina para organizaciones que buscan soluciones digitales de clase mundial que cumplan con estándares internacionales.',
    'Innovation, technical excellence, transparent execution, commitment to security and focus on measurable outcomes.': 'Innovación, excelencia técnica, ejecución transparente, compromiso con la seguridad y enfoque en resultados medibles.',
    'Technology leader with extensive experience designing and delivering scalable digital infrastructures. Focused on delivering high-impact solutions for educational and enterprise clients.': 'Líder tecnológico con amplia experiencia diseñando y entregando infraestructuras digitales escalables. Enfocado en entregar soluciones de alto impacto para clientes educativos y empresariales.',
    'Distributed systems architecture and resilient design': 'Arquitectura de sistemas distribuidos y diseño resiliente',
    'Technical leadership and management of multidisciplinary teams': 'Liderazgo técnico y gestión de equipos multidisciplinarios',
    'Implementation of AI and Machine Learning solutions': 'Implementación de soluciones de IA y Machine Learning',
    'Cybersecurity strategies and secure-by-design systems': 'Estrategias de ciberseguridad y sistemas seguros por diseño',
    'Extensive experience delivering high-performance platforms, collaborating with international teams and ensuring projects follow best practices in scalability, availability and security. Proven track record defining technical roadmaps and driving cross-functional delivery.': 'Amplia experiencia entregando plataformas de alto rendimiento, colaborando con equipos internacionales y asegurando que los proyectos sigan las mejores prácticas en escalabilidad, disponibilidad y seguridad. Historial comprobado definiendo hojas de ruta técnicas y impulsando la entrega multifuncional.',
    'We build high-performance technology platforms using agile methodologies and international standards. Our approach incorporates cutting-edge technologies such as Artificial Intelligence, Machine Learning and Cybersecurity.': 'Construimos plataformas tecnológicas de alto rendimiento utilizando metodologías ágiles y estándares internacionales. Nuestro enfoque incorpora tecnologías de vanguardia como Inteligencia Artificial, Machine Learning y Ciberseguridad.',
    'Educational Platforms': 'Plataformas Educativas',
    'Online learning systems (LMS), academic management platforms and collaborative tools designed for educational institutions of all levels.': 'Sistemas de aprendizaje en línea (LMS), plataformas de gestión académica y herramientas colaborativas diseñadas para instituciones educativas de todos los niveles.',
    'Web & Mobile Applications': 'Aplicaciones Web y Móviles',
    'Full-stack development of responsive web applications and native or hybrid mobile apps with optimized user experiences and scalable architectures.': 'Desarrollo full-stack de aplicaciones web responsivas y aplicaciones móviles nativas o híbridas con experiencias de usuario optimizadas y arquitecturas escalables.',
    'Publishing Platforms': 'Plataformas de Publicación',
    'Editorial management systems, institutional repositories, OJS platforms for academic journals and digital publishing solutions for scholarly content.': 'Sistemas de gestión editorial, repositorios institucionales, plataformas OJS para revistas académicas y soluciones de publicación digital para contenido académico.',
    'AI & Cybersecurity': 'IA y Ciberseguridad',
    'Implementation of Machine Learning workflows, model deployment and MLOps, secure-by-design systems, threat modeling and risk mitigation strategies.': 'Implementación de flujos de trabajo de Machine Learning, despliegue de modelos y MLOps, sistemas seguros por diseño, modelado de amenazas y estrategias de mitigación de riesgos.',
    'Proven Experience': 'Experiencia Comprobada',
    'Successful track record delivering high-performance platforms for educational and research institutions, collaborating with international teams.': 'Historial exitoso entregando plataformas de alto rendimiento para instituciones educativas y de investigación, colaborando con equipos internacionales.',
    'Cutting-edge Technology': 'Tecnología de Vanguardia',
    'We use industry-leading technologies, including modern frameworks, cloud architectures and AI-based solutions.': 'Utilizamos tecnologías líderes en la industria, incluyendo marcos modernos, arquitecturas en la nube y soluciones basadas en IA.',
    'Multidisciplinary Teams': 'Equipos Multidisciplinarios',
    'Technical leadership and mentorship of specialized teams, coordinating development, design, QA and operations professionals.': 'Liderazgo técnico y mentoría de equipos especializados, coordinando profesionales de desarrollo, diseño, QA y operaciones.',
    'Scalable Architectures': 'Arquitecturas Escalables',
    'We design resilient distributed systems that grow with your organization, ensuring high availability and optimal performance.': 'Diseñamos sistemas distribuidos resilientes que crecen con su organización, asegurando alta disponibilidad y rendimiento óptimo.',
    'Comprehensive Security': 'Seguridad Integral',
    'We implement security strategies from day one, with threat modeling and best practices to safeguard critical information.': 'Implementamos estrategias de seguridad desde el primer día, con modelado de amenazas y mejores prácticas para salvaguardar información crítica.',
    'Agile Methodologies': 'Metodologías Ágiles',
    'We apply agile frameworks that ensure transparency, iterative deliveries and fast adaptation to change.': 'Aplicamos marcos ágiles que aseguran transparencia, entregas iterativas y adaptación rápida al cambio.',
    'Let\'s discuss how we can help you achieve your technology goals with robust, scalable and secure solutions designed specifically for your organization.': 'Hablemos sobre cómo podemos ayudarle a lograr sus objetivos tecnológicos con soluciones robustas, escalables y seguras diseñadas específicamente para su organización.',
    'Learn More': 'Saber Más',
    'Transform Your Digital Presence': 'Transforma Tu Presencia Digital',
    'Web Development': 'Desarrollo Web',
    'Build stunning, high-performance websites that engage users and drive results. Our expert team delivers cutting-edge solutions tailored to your business needs.': 'Construye sitios web impresionantes y de alto rendimiento que involucren a los usuarios y generen resultados. Nuestro equipo experto entrega soluciones de vanguardia adaptadas a las necesidades de tu negocio.',
    'Featured Project': 'Proyecto Destacado',
    'Innovative Mobile Solutions': 'Soluciones Móviles Innovadoras',
    'Mobile Development': 'Desarrollo Móvil',
    'Create seamless mobile experiences that users love. Native iOS and Android apps built with modern frameworks for optimal performance.': 'Crea experiencias móviles perfectas que los usuarios aman. Aplicaciones nativas iOS y Android construidas con marcos modernos para rendimiento óptimo.',
    'New Service': 'Nuevo Servicio',
    'Scale Your Business with Cloud': 'Escala Tu Negocio con la Nube',
    'Cloud Infrastructure': 'Infraestructura en la Nube',
    'Leverage powerful cloud solutions to scale efficiently. Enterprise-grade infrastructure, security, and reliability for your growing business.': 'Aprovecha soluciones en la nube poderosas para escalar eficientemente. Infraestructura, seguridad y confiabilidad de nivel empresarial para tu negocio en crecimiento.',
    'Popular Choice': 'Elección Popular',
    'Data-Driven Insights': 'Perspectivas Basadas en Datos',
    'Data Analytics': 'Análisis de Datos',
    'Unlock the power of your data with advanced analytics and visualization. Make informed decisions that drive growth and innovation.': 'Desbloquea el poder de tus datos con análisis avanzados y visualización. Toma decisiones informadas que impulsen el crecimiento y la innovación.',
    'Top Rated': 'Mejor Calificado',
    'Seamless User Experiences': 'Experiencias de Usuario Perfectas',
    'UI/UX Design': 'Diseño UI/UX',
    'Craft intuitive and engaging user experiences that drive satisfaction and loyalty. Our design team focuses on user-centered solutions.': 'Crea experiencias de usuario intuitivas y atractivas que impulsen la satisfacción y la lealtad. Nuestro equipo de diseño se enfoca en soluciones centradas en el usuario.',
    'Client Favorite': 'Favorito del Cliente',
    'Robust E-commerce Platforms': 'Plataformas de E-commerce Robustas',
    'E-commerce Solutions': 'Soluciones de E-commerce',
    'Develop scalable e-commerce platforms that enhance customer experience and boost sales. Integrated solutions for all your online business needs.': 'Desarrolla plataformas de e-commerce escalables que mejoren la experiencia del cliente y aumenten las ventas. Soluciones integradas para todas las necesidades de tu negocio en línea.',
    'Best Seller': 'Mejor Vendido',
    'Advanced Cybersecurity Measures': 'Medidas Avanzadas de Ciberseguridad',
    'Cybersecurity Services': 'Servicios de Ciberseguridad',
    'Protect your digital assets with state-of-the-art cybersecurity solutions. Comprehensive strategies to safeguard against evolving threats.': 'Protege tus activos digitales con soluciones de ciberseguridad de última generación. Estrategias integrales para salvaguardar contra amenazas en evolución.',
    'Secure Choice': 'Elección Segura',
    'Efficient IT Consulting': 'Consultoría IT Eficiente',
    'IT Consulting Services': 'Servicios de Consultoría IT',
    'Optimize your IT infrastructure with expert consulting services. Tailored strategies to enhance efficiency, reduce costs, and drive innovation.': 'Optimiza tu infraestructura IT con servicios de consultoría experta. Estrategias personalizadas para mejorar la eficiencia, reducir costos e impulsar la innovación.',
    'Trusted Advisor': 'Asesor de Confianza',
    'Cutting-Edge AI Solutions': 'Soluciones de IA de Vanguardia',
    'Artificial Intelligence': 'Inteligencia Artificial',
    'Implement AI-driven solutions to automate processes and gain competitive advantages. From machine learning to natural language processing, we cover it all.': 'Implementa soluciones impulsadas por IA para automatizar procesos y obtener ventajas competitivas. Desde machine learning hasta procesamiento de lenguaje natural, lo cubrimos todo.',
    'Innovative Tech': 'Tecnología Innovadora',
    'Comprehensive Digital Marketing': 'Marketing Digital Integral',
    'Digital Marketing Services': 'Servicios de Marketing Digital',
    'Boost your online presence with targeted digital marketing strategies. SEO, SEM, social media, and content marketing to drive traffic and conversions.': 'Impulsa tu presencia en línea con estrategias de marketing digital dirigidas. SEO, SEM, redes sociales y marketing de contenido para impulsar tráfico y conversiones.',
    'Marketing Expert': 'Experto en Marketing',
    'Innovative IoT Solutions': 'Soluciones IoT Innovadoras',
    'Internet of Things': 'Internet de las Cosas',
    'Connect and manage devices with our IoT solutions. From smart homes to industrial applications, we provide end-to-end IoT services.': 'Conecta y gestiona dispositivos con nuestras soluciones IoT. Desde hogares inteligentes hasta aplicaciones industriales, proporcionamos servicios IoT de extremo a extremo.',
    'Next-Gen Blockchain Development': 'Desarrollo Blockchain de Nueva Generación',
    'Blockchain Solutions': 'Soluciones Blockchain',
    'Leverage blockchain technology for secure and transparent transactions. Custom blockchain development for various industries and applications.': 'Aprovecha la tecnología blockchain para transacciones seguras y transparentes. Desarrollo blockchain personalizado para varias industrias y aplicaciones.',
    'Cutting Edge': 'Vanguardia',
    'Immersive AR/VR Experiences': 'Experiencias AR/VR Inmersivas',
    'Augmented & Virtual Reality': 'Realidad Aumentada y Virtual',
    'Create engaging AR and VR experiences that captivate users. From gaming to training simulations, we bring your ideas to life with immersive technology.': 'Crea experiencias AR y VR atractivas que cautiven a los usuarios. Desde juegos hasta simulaciones de entrenamiento, damos vida a tus ideas con tecnología inmersiva.',
    'Efficient Robotic Process Automation': 'Automatización Robótica de Procesos Eficiente',
    'RPA Solutions': 'Soluciones RPA',
    'Automate repetitive tasks with our RPA solutions. Increase efficiency and reduce errors with intelligent automation tailored to your business processes.': 'Automatiza tareas repetitivas con nuestras soluciones RPA. Aumenta la eficiencia y reduce errores con automatización inteligente adaptada a tus procesos de negocio.',
    'Productivity Boost': 'Impulso de Productividad',
    'Comprehensive Software Testing': 'Pruebas de Software Integrales',
    'QA & Testing Services': 'Servicios de QA y Pruebas',
    'Ensure the quality and reliability of your software with our comprehensive testing services. Manual and automated testing tailored to your project needs.': 'Asegura la calidad y confiabilidad de tu software con nuestros servicios de pruebas integrales. Pruebas manuales y automatizadas adaptadas a las necesidades de tu proyecto.',
    'Quality First': 'Calidad Primero',
    'Seamless System Integration': 'Integración de Sistemas Perfecta',
    'Integration Services': 'Servicios de Integración',
    'Integrate disparate systems and applications for seamless data flow and improved efficiency. Customized integration solutions to meet your business needs.': 'Integra sistemas y aplicaciones dispares para flujo de datos perfecto y eficiencia mejorada. Soluciones de integración personalizadas para satisfacer las necesidades de tu negocio.',
    'Connected Solutions': 'Soluciones Conectadas',
    'Cutting-Edge Quantum Computing': 'Computación Cuántica de Vanguardia',
    'Quantum Solutions': 'Soluciones Cuánticas',
    'Explore the potential of quantum computing with our innovative solutions. From research to application, we help you harness the power of quantum technology.': 'Explora el potencial de la computación cuántica con nuestras soluciones innovadoras. Desde investigación hasta aplicación, te ayudamos a aprovechar el poder de la tecnología cuántica.',
    'Future Ready': 'Listo para el Futuro',
    'Advanced Geographic Information Systems': 'Sistemas de Información Geográfica Avanzados',
    'GIS Solutions': 'Soluciones GIS',
    'Utilize GIS technology for spatial data analysis and visualization. Customized GIS solutions for various industries and applications.': 'Utiliza tecnología GIS para análisis y visualización de datos espaciales. Soluciones GIS personalizadas para varias industrias y aplicaciones.',
    'Spatial Expert': 'Experto Espacial',
    'Welcome to': 'Bienvenido a',
    'Discover the future of innovation with our cutting-edge platform. Start your journey today.': 'Descubre el futuro de la innovación con nuestra plataforma de vanguardia. Comienza tu viaje hoy.',
    'Get Started': 'Comenzar',
    'Search research papers, projects, or topics...': 'Buscar artículos de investigación, proyectos o temas...',
    'Popular searches:': 'Búsquedas populares:',
    'Machine Learning': 'Machine Learning',
    'AI Research': 'Investigación en IA',
    'Data Science': 'Ciencia de Datos',
    'Neuroscience': 'Neurociencia',
    'Hello from Next.js!': '¡Hola desde Next.js!',
    'Research Dashboard': 'Panel de Investigación',
    'Welcome back! Here\'s your research overview.': '¡Bienvenido de vuelta! Aquí está tu resumen de investigación.',
    'Total Papers': 'Total de Artículos',
    'Active Projects': 'Proyectos Activos',
    'Collaborations': 'Colaboraciones',
    'This Month': 'Este Mes',
    'Recent Papers': 'Artículos Recientes',
    'View All': 'Ver Todo',
    'No papers added yet': 'Aún no se han agregado artículos',
    'Add your first paper': 'Agrega tu primer artículo',
    'Manage': 'Gestionar',
    'No projects yet': 'Aún no hay proyectos',
    'Create your first project': 'Crea tu primer proyecto',
    'Quick Actions': 'Acciones Rápidas',
    'Add New Paper': 'Agregar Nuevo Artículo',
    'Create Project': 'Crear Proyecto',
    'Search Library': 'Buscar en Biblioteca',
    'Research Library': 'Biblioteca de Investigación',
    'Your personal collection of scientific papers': 'Tu colección personal de artículos científicos',
    'Unread': 'No Leído',
    'Read': 'Leído',
    'Tags': 'Etiquetas',
    'Search papers...': 'Buscar artículos...',
    'All Tags': 'Todas las Etiquetas',
    'Sort by Date': 'Ordenar por Fecha',
    'Sort by Title': 'Ordenar por Título',
    'Sort by Citations': 'Ordenar por Citas',
    'No papers found': 'No se encontraron artículos',
    'Try adjusting your filters': 'Intenta ajustar tus filtros',
    'Add your first paper to get started': 'Agrega tu primer artículo para comenzar',
    'Add Papers': 'Agregar Artículos',
    'Research Manager': 'Gestor de Investigación',
    'Manage your research papers and projects': 'Gestiona tus artículos de investigación y proyectos',
    'Search papers and projects...': 'Buscar artículos y proyectos...',
    'Search APIs': 'Buscar en APIs',
    'Searching...': 'Buscando...',
    'Add Paper': 'Agregar Artículo',
    'Add Project': 'Agregar Proyecto',
    'Search Results from CrossRef': 'Resultados de Búsqueda de CrossRef',
    'Add to Library': 'Agregar a Biblioteca',
    'Search by DOI': 'Buscar por DOI',
    'Enter DOI (e.g., 10.1038/nature12373)': 'Ingresa DOI (ej., 10.1038/nature12373)',
    'Search': 'Buscar',
    'Search by Title': 'Buscar por Título',
    'Enter paper title': 'Ingresa título del artículo',
    'Search Results': 'Resultados de Búsqueda',
    'Title': 'Título',
    'Authors': 'Autores',
    'Enter authors separated by commas': 'Ingresa autores separados por comas',
    'Abstract': 'Resumen',
    'Journal': 'Revista',
    'Publication Date': 'Fecha de Publicación',
    'Enter tags separated by commas': 'Ingresa etiquetas separadas por comas',
    'Adding...': 'Agregando...',
    'Cancel': 'Cancelar',
    // Auth translations
    'Sign In': 'Iniciar Sesión',
    'Sign Up': 'Registrarse',
    'Sign Out': 'Cerrar Sesión',
    'Profile': 'Perfil',
    'Loading...': 'Cargando...',
    'Welcome Back': 'Bienvenido de Nuevo',
    'Sign in to your research account': 'Inicia sesión en tu cuenta de investigación',
    'Email Address': 'Correo Electrónico',
    'Enter your email': 'Ingresa tu correo electrónico',
    'Password': 'Contraseña',
    'Enter your password': 'Ingresa tu contraseña',
    'Signing In...': 'Iniciando Sesión...',
    "Don't have an account?": "¿No tienes una cuenta?",
    'Sign up': 'Regístrate',
    'Create Account': 'Crear Cuenta',
    'Join our research community': 'Únete a nuestra comunidad de investigación',
    'Full Name': 'Nombre Completo',
    'Enter your full name': 'Ingresa tu nombre completo',
    'Affiliation': 'Afiliación',
    'University, Institution, Company': 'Universidad, Institución, Empresa',
    'Research Interests': 'Intereses de Investigación',
    'AI, Machine Learning, Data Science (separated by commas)': 'IA, Aprendizaje Automático, Ciencia de Datos (separados por comas)',
    'Create a password': 'Crea una contraseña',
    'Confirm Password': 'Confirmar Contraseña',
    'Confirm your password': 'Confirma tu contraseña',
    'Creating Account...': 'Creando Cuenta...',
    'Already have an account?': '¿Ya tienes una cuenta?',
    'Sign in': 'Inicia sesión',
    'Edit Profile': 'Editar Perfil',
    'Save': 'Guardar',
    'Saving...': 'Guardando...',
    'Not specified': 'No especificado',
    'No interests specified': 'No se especificaron intereses',
    'Authentication Required': 'Autenticación Requerida',
    'Please sign in to access this page': 'Por favor inicia sesión para acceder a esta página',
    'Redirecting to login...': 'Redirigiendo al inicio de sesión...',
  },
};

// Crear el contexto
const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

// Función para traducir texto usando API externa
const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  // Skip empty or very short texts
  if (!text || text.trim().length < 2) return text;
  
  // Skip texts that are likely not translatable (URLs, emails, numbers, etc.)
  if (/^[0-9\s\-\.\,\:\;\(\)\[\]]+$/.test(text) || 
      /^https?:\/\//.test(text) || 
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(text) ||
      /^[A-Z0-9\s\-_]+$/.test(text)) {
    return text;
  }

  // First check if we have a cached translation
  const cachedKey = `${targetLanguage}_${text}`;
  const cached = localStorage.getItem(cachedKey);
  if (cached) {
    return cached;
  }

  // If it's English or we have a static translation, use it
  if (targetLanguage === 'en' || staticTranslations[targetLanguage]?.[text]) {
    return staticTranslations[targetLanguage]?.[text] || text;
  }

  try {
    // Use Firebase Cloud Function as proxy for LibreTranslate API
    // Get project ID from Firebase config or use environment variable
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'innovationplatforms';
    const functionUrl = `https://us-central1-${projectId}.cloudfunctions.net/translateText`;
    
    const response = await fetch(functionUrl, {
      method: "POST",
      body: JSON.stringify({
        q: text,
        source: "auto",
        target: targetLanguage,
        format: "text"
      }),
      headers: { "Content-Type": "application/json" }
    });

    if (response.ok) {
      const data = await response.json();
      const translatedText = data.translatedText || text;
      
      // Cache the translation
      localStorage.setItem(cachedKey, translatedText);
      
      return translatedText;
    } else {
      console.warn('Translation API returned error:', response.status, response.statusText);
    }
  } catch (error) {
    console.warn('Translation failed, using fallback:', error);
  }

  // Fallback to static translation or original text
  return staticTranslations[targetLanguage]?.[text] || text;
};

// Provider del contexto
export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedLanguage, setSelectedLanguageState] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);

  // Cargar idioma guardado al inicializar
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage && languages.find(lang => lang.code === savedLanguage)) {
      // Usar setTimeout para evitar cascading renders
      setTimeout(() => {
        setSelectedLanguageState(savedLanguage);
      }, 0);
    }
  }, []);

  // Función para cambiar idioma
  const setSelectedLanguage = (language: string) => {
    setSelectedLanguageState(language);
    localStorage.setItem('selectedLanguage', language);
    
    // Trigger global translation
    setIsTranslating(true);
    setTimeout(() => {
      translateAllVisibleText(language);
      setIsTranslating(false);
    }, 100);
  };

  // Función de traducción síncrona (para textos estáticos)
  const translate = (text: string): string => {
    return staticTranslations[selectedLanguage]?.[text] || text;
  };

  // Función de traducción asíncrona (para textos dinámicos)
  const translateAsync = async (text: string): Promise<string> => {
    return await translateText(text, selectedLanguage);
  };

  // Función para traducir todo el contenido visible
  const translateAllVisibleText = async (language: string) => {
    if (language === 'en') {
      // Si es inglés, restaurar textos originales
      const elements = document.querySelectorAll('[data-original-text]');
      elements.forEach(element => {
        const originalText = element.getAttribute('data-original-text');
        if (originalText && element.textContent !== originalText) {
          element.textContent = originalText;
        }
      });
      
      // También restaurar placeholders
      const placeholderElements = document.querySelectorAll('[data-original-placeholder]');
      placeholderElements.forEach(element => {
        const originalPlaceholder = element.getAttribute('data-original-placeholder');
        if (originalPlaceholder) {
          element.setAttribute('placeholder', originalPlaceholder);
        }
      });
      return;
    }

    // Elementos a traducir
    const elementsToTranslate = [
      ...document.querySelectorAll('h1, h2, h3, h4, h5, h6'),
      ...document.querySelectorAll('p, span, div, a, button, label'),
      ...document.querySelectorAll('input[placeholder], textarea[placeholder]'),
      ...document.querySelectorAll('[class*="text-"], [class*="font-"]')
    ];

    // Procesar cada elemento
    for (const element of elementsToTranslate) {
      // Skip if already translated
      if (element.hasAttribute('data-original-text')) continue;
      
      // Skip script/style elements
      if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'META', 'LINK'].includes(element.tagName)) continue;
      
      // Skip if marked as no-translate
      if (element.hasAttribute('data-no-translate')) continue;

      try {
        // Handle text content
        const text = element.textContent?.trim();
        if (text && text.length > 2 && text.length < 500) {
          // Skip if it's just numbers, URLs, emails, or very short strings
          if (
            /^[0-9\s\-\.\,\:\;\(\)\[\]]+$/.test(text) ||
            /^https?:\/\//.test(text) ||
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(text) ||
            /^[A-Z0-9\s\-_]+$/.test(text) ||
            text.length < 3
          ) {
            continue;
          }

          const translatedText = await translateText(text, language);
          if (translatedText !== text) {
            element.setAttribute('data-original-text', text);
            element.textContent = translatedText;
          }
        }

        // Handle placeholder attributes
        const placeholder = element.getAttribute('placeholder');
        if (placeholder && placeholder.length > 2) {
          const translatedPlaceholder = await translateText(placeholder, language);
          if (translatedPlaceholder !== placeholder) {
            element.setAttribute('data-original-placeholder', placeholder);
            element.setAttribute('placeholder', translatedPlaceholder);
          }
        }

        // Small delay to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 50));
        
      } catch (error) {
        console.warn('Failed to translate element:', element, error);
      }
    }
  };

  // Observer para detectar cambios en el DOM
  useEffect(() => {
    if (selectedLanguage === 'en') return;

    let translationTimeout: NodeJS.Timeout;

    const observer = new MutationObserver(async (mutations) => {
      let shouldTranslate = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              const textNodes = element.querySelectorAll('*');
              if (textNodes.length > 0 || element.textContent?.trim()) {
                shouldTranslate = true;
              }
            }
          });
        }
      });

      if (shouldTranslate && !isTranslating) {
        if (translationTimeout) {
          clearTimeout(translationTimeout);
        }
        
        translationTimeout = setTimeout(async () => {
          if (!isTranslating) {
            setIsTranslating(true);
            await translateAllVisibleText(selectedLanguage);
            setIsTranslating(false);
          }
        }, 1000);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => {
      observer.disconnect();
      if (translationTimeout) {
        clearTimeout(translationTimeout);
      }
    };
  }, [selectedLanguage, isTranslating]);

  const value: TranslationContextType = {
    selectedLanguage,
    setSelectedLanguage,
    translate,
    translateAsync,
    languages,
    isTranslating,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};
