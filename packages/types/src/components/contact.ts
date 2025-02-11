export interface ContactProps {
  data: {
    label: string;
    items: ContactItem[];
  };
  className?: string;
}

export interface ContactItem {
  service: string;
  value: string;
}
