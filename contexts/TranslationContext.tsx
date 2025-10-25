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
  { code: 'es', name: 'Español – América Latina', flag: '🇲🇽' },
  { code: 'zh', name: '中文 – 简体', flag: '🇨🇳' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

// Traducciones estáticas para textos comunes
const staticTranslations: Record<string, Record<string, string>> = {
  en: {
    'Innova Proyectos': 'Innova Proyectos',
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
  },
  es: {
    'Innova Proyectos': 'Innova Proyectos',
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
  },
  zh: {
    'Innova Proyectos': '创新项目',
    'Development & Consulting': '开发与咨询',
    'About': '关于',
    'Services': '服务',
    'Dashboard': '仪表板',
    'Research': '研究',
    'Library': '图书馆',
    'Contact': '联系',
    'Home': '首页',
    'Analytics': '分析',
    'Projects': '项目',
    'Quick Links': '快速链接',
    'Connect With Us': '与我们联系',
    'Follow us on social media for updates and news': '在社交媒体上关注我们获取更新和新闻',
    'Privacy Policy': '隐私政策',
    'Terms of Service': '服务条款',
    'All rights reserved': '版权所有',
    'Mission': '使命',
    'Vision': '愿景',
    'Values': '价值观',
    'Our Solutions': '我们的解决方案',
    'Why Choose Us': '为什么选择我们',
    'Ready to transform your digital infrastructure?': '准备好改造您的数字基础设施了吗？',
    'Contact Us': '联系我们',
    'Request Consultation': '请求咨询',
    'Send Message': '发送消息',
    'Sending…': '发送中…',
    'Message sent — we will contact you shortly.': '消息已发送 — 我们将很快与您联系。',
    'Opened mail client as a fallback.': '已打开邮件客户端作为备用方案。',
    'Or reach us directly:': '或直接联系我们：',
    'Name': '姓名',
    'Email': '电子邮件',
    'Organization': '组织',
    'Message': '消息',
    'Your full name': '您的全名',
    'you@company.com': 'you@company.com',
    'Company or institution': '公司或机构',
    'Tell us briefly about your project or needs': '简要告诉我们您的项目或需求',
    'Please enter your name.': '请输入您的姓名。',
    'Please enter your email.': '请输入您的电子邮件。',
    'Please enter a valid email.': '请输入有效的电子邮件。',
    'Please enter a message.': '请输入消息。',
    'Fill the form and we will get back to you within 1-2 business days.': '填写表格，我们将在1-2个工作日内回复您。',
    'optional': '可选',
  },
  de: {
    'Innova Proyectos': 'Innova Proyectos',
    'Development & Consulting': 'Entwicklung & Beratung',
    'About': 'Über uns',
    'Services': 'Dienstleistungen',
    'Dashboard': 'Dashboard',
    'Research': 'Forschung',
    'Library': 'Bibliothek',
    'Contact': 'Kontakt',
    'Home': 'Startseite',
    'Analytics': 'Analytik',
    'Projects': 'Projekte',
    'Quick Links': 'Schnelllinks',
    'Connect With Us': 'Verbinden Sie sich mit uns',
    'Follow us on social media for updates and news': 'Folgen Sie uns in den sozialen Medien für Updates und Nachrichten',
    'Privacy Policy': 'Datenschutzrichtlinie',
    'Terms of Service': 'Nutzungsbedingungen',
    'All rights reserved': 'Alle Rechte vorbehalten',
    'Mission': 'Mission',
    'Vision': 'Vision',
    'Values': 'Werte',
    'Our Solutions': 'Unsere Lösungen',
    'Why Choose Us': 'Warum uns wählen',
    'Ready to transform your digital infrastructure?': 'Bereit, Ihre digitale Infrastruktur zu transformieren?',
    'Contact Us': 'Kontaktieren Sie uns',
    'Request Consultation': 'Beratung anfordern',
    'Send Message': 'Nachricht senden',
    'Sending…': 'Senden…',
    'Message sent — we will contact you shortly.': 'Nachricht gesendet — wir werden Sie bald kontaktieren.',
    'Opened mail client as a fallback.': 'E-Mail-Client als Fallback geöffnet.',
    'Or reach us directly:': 'Oder erreichen Sie uns direkt:',
    'Name': 'Name',
    'Email': 'E-Mail',
    'Organization': 'Organisation',
    'Message': 'Nachricht',
    'Your full name': 'Ihr vollständiger Name',
    'you@company.com': 'you@company.com',
    'Company or institution': 'Unternehmen oder Institution',
    'Tell us briefly about your project or needs': 'Erzählen Sie uns kurz über Ihr Projekt oder Ihre Bedürfnisse',
    'Please enter your name.': 'Bitte geben Sie Ihren Namen ein.',
    'Please enter your email.': 'Bitte geben Sie Ihre E-Mail ein.',
    'Please enter a valid email.': 'Bitte geben Sie eine gültige E-Mail ein.',
    'Please enter a message.': 'Bitte geben Sie eine Nachricht ein.',
    'Fill the form and we will get back to you within 1-2 business days.': 'Füllen Sie das Formular aus und wir werden uns innerhalb von 1-2 Werktagen bei Ihnen melden.',
    'optional': 'optional',
  },
  fr: {
    'Innova Proyectos': 'Innova Proyectos',
    'Development & Consulting': 'Développement et Conseil',
    'About': 'À propos',
    'Services': 'Services',
    'Dashboard': 'Tableau de bord',
    'Research': 'Recherche',
    'Library': 'Bibliothèque',
    'Contact': 'Contact',
    'Home': 'Accueil',
    'Analytics': 'Analytique',
    'Projects': 'Projets',
    'Quick Links': 'Liens rapides',
    'Connect With Us': 'Connectez-vous avec nous',
    'Follow us on social media for updates and news': 'Suivez-nous sur les réseaux sociaux pour les mises à jour et les nouvelles',
    'Privacy Policy': 'Politique de confidentialité',
    'Terms of Service': 'Conditions de service',
    'All rights reserved': 'Tous droits réservés',
    'Mission': 'Mission',
    'Vision': 'Vision',
    'Values': 'Valeurs',
    'Our Solutions': 'Nos Solutions',
    'Why Choose Us': 'Pourquoi nous choisir',
    'Ready to transform your digital infrastructure?': 'Prêt à transformer votre infrastructure numérique ?',
    'Contact Us': 'Contactez-nous',
    'Request Consultation': 'Demander une consultation',
    'Send Message': 'Envoyer un message',
    'Sending…': 'Envoi en cours…',
    'Message sent — we will contact you shortly.': 'Message envoyé — nous vous contacterons bientôt.',
    'Opened mail client as a fallback.': 'Client de messagerie ouvert comme solution de secours.',
    'Or reach us directly:': 'Ou contactez-nous directement :',
    'Name': 'Nom',
    'Email': 'E-mail',
    'Organization': 'Organisation',
    'Message': 'Message',
    'Your full name': 'Votre nom complet',
    'you@company.com': 'you@company.com',
    'Company or institution': 'Entreprise ou institution',
    'Tell us briefly about your project or needs': 'Parlez-nous brièvement de votre projet ou de vos besoins',
    'Please enter your name.': 'Veuillez entrer votre nom.',
    'Please enter your email.': 'Veuillez entrer votre e-mail.',
    'Please enter a valid email.': 'Veuillez entrer un e-mail valide.',
    'Please enter a message.': 'Veuillez entrer un message.',
    'Fill the form and we will get back to you within 1-2 business days.': 'Remplissez le formulaire et nous vous répondrons dans 1-2 jours ouvrables.',
    'optional': 'optionnel',
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
    // Use LibreTranslate API for dynamic translation
    const response = await fetch("https://libretranslate.de/translate", {
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
      setSelectedLanguageState(savedLanguage);
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
