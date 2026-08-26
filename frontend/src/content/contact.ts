export type ContactContent = {
  path: string;
  eyebrow: string;
  title: string;
  email: string;
  phone: string;
  phoneHref: string;
  formIntro: string;
};

export const contactPage: ContactContent = {
  path: "/contact",
  eyebrow: "CONTACT",
  title: "Get in touch",
  email: "hello@vyuha.ai",
  phone: "+91 11 4108 2200",
  phoneHref: "tel:+911141082200",
  formIntro: "Send a message and we will follow up.",
};
