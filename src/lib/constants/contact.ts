export interface HelplineNumber {
  raw: string;
  tel: string;
  display: string;
  label: string;
}

export const HELPLINE_NUMBERS: HelplineNumber[] = [
  {
    raw: "9628258275",
    tel: "+919628258275",
    display: "+91 96282 58275",
    label: "Dispatch Line 1",
  },
  {
    raw: "9838544478",
    tel: "+919838544478",
    display: "+91 98385 44478",
    label: "Dispatch Line 2",
  },
  {
    raw: "9721800444",
    tel: "+919721800444",
    display: "+91 97218 00444",
    label: "Customer Support",
  },
];

export const PRIMARY_PHONE = HELPLINE_NUMBERS[0];
export const WHATSAPP_NUMBER = "919628258275";
