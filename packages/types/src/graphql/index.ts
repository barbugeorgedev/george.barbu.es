export interface ResumeData {
  content(arg0: string, content: any): unknown;
  header(arg0: string, header: any): unknown;
  sidebar(arg0: string, sidebar: any): unknown;
  name: string;
  social: { name: string; url: string }[];
  footer: string; // Assuming the footer is a string, change to match your structure
}
