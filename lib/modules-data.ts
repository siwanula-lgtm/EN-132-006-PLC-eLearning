export interface ModuleData {
  id: string;
  week: string;
  titleTh: string;
  titleEn: string;
  description: string;
  clo: string;
  hoursT: number;
  hoursP: number;
  topics: string[];
  labTitle: string;
  reviewSheet: string;
  icon: string;
  color: string;
}

// 10 หน่วยเรียน ตามเอกสารประกอบการสอน EN-132-006 (สัปดาห์ ชั่วโมง ท/ป ตามกำหนดการสอน)
export const modules: ModuleData[] = [
  {
    id: "01",
    week: "1",
    titleTh: "บทนำเกี่ยวกับโปรแกรมเมเบิลลอจิกคอนโทรลเลอร์ (PLC)",
    titleEn: "Introduction to Programmable Logic Controllers",
    description:
      "โปรแกรมเมเบิลลอจิกคอนโทรลเลอร์ (PLC) เป็นอุปกรณ์ควบคุมเชิงดิจิทัลที่ออกแบบสําหรับงาน อุตสาหกรรม ประกอบด้วยส่วนสําคัญ ได้แก่ หน่วยประมวลผลกลาง (CPU) หน่วยความจํา ส่วนอินพุต ส่วน เอาต์พุต และระบบจ่ายไฟ PLC …",
    clo: "CLO3",
    hoursT: 2,
    hoursP: 3,
    topics: ["1.1 คำนิยามและความหมายของโปรแกรมเมเบิลลอจิกคอนโทรลเลอร์", "1.2 ผู้ผลิตโปรแกรมเมเบิลลอจิกคอนโทรลเลอร์และโปรแกรมที่ใช้ในการเขียนโปรแกรมควบคุม", "1.3 วิวัฒนาการของระบบ PLC จากอดีตจนถึงปัจจุบัน", "1.4 โครงสร้างภายในและสถาปัตยกรรมของ PLC", "1.5 ประเภทของการเชื่อมต่อวงจรอินพุตของ PLC", "1.6 ประเภทของการเชื่อมต่อวงจรเอาต์พุตของ PLC", "1.7 ประเภทของเอาต์พุตของ PLC", "1.8 การอ่านและวิเคราะห์ข้อมูลจากป้ายแสดงคุณลักษณะจำเพาะของ PLC", "1.9 ภาษาที่ใช้ในการเขียนโปรแกรมสำหรับ PLC", "1.10 การเชื่อมต่อวงจรไฟฟ้าของ PLC", "1.11 อุปกรณ์และพารามิเตอร์ที่เกี่ยวข้องกับการใช้งาน PLC"],
    labTitle: "การสำรวจโครงสร้าง ป้ายคุณลักษณะ และการเชื่อมต่อวงจรไฟฟ้าของ PLC",
    reviewSheet: "review_sheet_01.html",
    icon: "Cpu",
    color: "slate",
  },
  {
    id: "02",
    week: "2",
    titleTh: "ระบบอินพุตและเอาต์พุตของ PLC",
    titleEn: "PLC Input and Output Systems",
    description:
      "ระบบอินพุตและเอาต์พุตของ PLC ประกอบด้วยอุปกรณ์หลากหลายชนิดที่ทำหน้าที่รับสัญญาณจากสภาพแวดล้อมและแสดงผลการทำงาน โดยฝั่งอินพุต ได้แก่ Push Button, Proximity Sensor และ Encoder ส่วนฝั่งเอาต์พุต ได้แก่ Pilot Lamp, Tower Lamp, Relay …",
    clo: "CLO3",
    hoursT: 2,
    hoursP: 3,
    topics: ["2.1 Push Button", "2.2 Proximity Sensor", "2.3 Encoder", "2.4 Pilot Lamp", "2.5 Tower Lamp", "2.6 Relay", "2.7 Motor"],
    labTitle: "การต่อวงจรอุปกรณ์อินพุตและเอาต์พุตกับ PLC และทดสอบด้วยโหมด Monitor",
    reviewSheet: "review_sheet_02.html",
    icon: "ToggleRight",
    color: "blue",
  },
  {
    id: "03",
    week: "3",
    titleTh: "การใช้งาน PLC",
    titleEn: "Using the PLC with GX Works3",
    description:
      "การใช้งาน PLC ในระบบอุตสาหกรรมจำเป็นต้องอาศัยโปรแกรม GX Works3 ของ Mitsubishi Electric ซึ่งเป็นซอฟต์แวร์ที่ใช้เขียนและจัดการโปรแกรมควบคุม PLC ตระกูล MELSEC iQ-F และ iQ-R การเรียนรู้ในหน่วยนี้ครอบคลุมตั้งแต่การติดตั้งโปรแกรม …",
    clo: "CLO1",
    hoursT: 2,
    hoursP: 3,
    topics: ["3.1 ติดตั้งโปรแกรม GX Works3 และอัปเดตระบบให้พร้อมใช้งาน", "3.2 ส่วนประกอบของโปรแกรม GX Works3", "3.3 การเชื่อมต่อ PLC กับคอมพิวเตอร์", "3.4 การเขียนและอ่านข้อมูลจาก PLC", "3.5 การจำลองการทำงานของโปรแกรมในระบบ PLC", "3.6 การตรวจสอบและติดตามการทำงานของระบบ PLC แบบเรียลไทม์"],
    labTitle: "การเชื่อมต่อ PLC กับคอมพิวเตอร์และการใช้งานโปรแกรม GX Works3",
    reviewSheet: "review_sheet_03.html",
    icon: "Laptop",
    color: "green",
  },
  {
    id: "04",
    week: "4–5",
    titleTh: "การเขียนโปรแกรมควบคุมด้วยคำสั่งพื้นฐานของโปรแกรมเมเบิลลอจิกคอนโทรลเลอร์ (PLC)",
    titleEn: "Basic PLC Programming Instructions",
    description:
      "การเขียนโปรแกรมควบคุมด้วยคำสั่งพื้นฐานของ PLC ในโปรแกรม GX Works3 ประกอบด้วยคำสั่งหลัก ได้แก่ AND, OR, Interlock Input/Output, Self Holding, SET/RESET, Zone Reset, Timer, Counter, Rising Edge, Falling Edge และ MOV …",
    clo: "CLO1",
    hoursT: 4,
    hoursP: 6,
    topics: ["4.1 คำสั่ง AND", "4.2 คำสั่ง OR Gate", "4.4 คำสั่ง Interlock Output", "4.5 คำสั่ง Self Holding", "4.6 คำสั่ง SET / RESET", "4.7 คำสั่ง Zone Reset", "4.8 คำสั่ง Timer", "4.9 คำสั่ง Counter", "4.10 คำสั่ง Rising (ขอบขาขึ้น)", "4.11 คำสั่ง Falling (ขอบขาลง)", "4.12 คำสั่ง MOV"],
    labTitle: "การเขียนโปรแกรมควบคุมด้วยคำสั่งพื้นฐานของ PLC",
    reviewSheet: "review_sheet_04.html",
    icon: "ListTree",
    color: "yellow",
  },
  {
    id: "05",
    week: "6",
    titleTh: "บทนำเกี่ยวกับ HMI (Human Machine Interface)",
    titleEn: "Introduction to HMI",
    description:
      "Human Machine Interface (HMI) คืออุปกรณ์ที่ทำหน้าที่เป็นสื่อกลางระหว่างผู้ใช้งานกับเครื่องจักรหรือระบบอัตโนมัติ เพื่อให้ผู้ควบคุมสามารถตรวจสอบสถานะและสั่งงานระบบได้อย่างสะดวก โดยทั่วไป HMI จะทำงานร่วมกับ PLC …",
    clo: "CLO2",
    hoursT: 2,
    hoursP: 3,
    topics: ["5.1 HMI คืออะไร", "5.2 ข้อดี/ข้อเสีย HMI", "5.3 ส่วนประกอบ HMI", "5.4 การลงโปรแกรม GT Designer3 และ Update", "5.5 ส่วนประกอบโปรแกรม GT Designer3", "5.6 การเชื่อมต่อ PLC กับ HMI"],
    labTitle: "การเชื่อมต่อ HMI กับ PLC และการใช้งานโปรแกรม GT Designer3",
    reviewSheet: "review_sheet_05.html",
    icon: "MonitorSmartphone",
    color: "red",
  },
  {
    id: "06",
    week: "7",
    titleTh: "การใช้งานพื้นฐาน HMI",
    titleEn: "Basic HMI Operation",
    description:
      "Human Machine Interface (HMI) เป็นตัวกลางที่เชื่อมต่อระหว่างผู้ปฏิบัติงานกับเครื่องจักรในระบบควบคุมอัตโนมัติ โดยใช้ซอฟต์แวร์ GT Designer3 ของ Mitsubishi ในการออกแบบหน้าจอ ประกอบด้วยวัตถุหลัก ได้แก่ Bit Switch สำหรับสั่งงาน Bit …",
    clo: "CLO2",
    hoursT: 2,
    hoursP: 3,
    topics: ["6.1 Read/Write HMI", "6.2 Bit Switch", "6.3 Bit Lamp", "6.4 Numerical Display", "6.5 Numerical Input"],
    labTitle: "การออกแบบหน้าจอควบคุมพื้นฐานด้วย HMI",
    reviewSheet: "review_sheet_06.html",
    icon: "LayoutPanelTop",
    color: "purple",
  },
  {
    id: "07",
    week: "9",
    titleTh: "การสื่อสารระหว่าง PLC กับอุปกรณ์อื่น ๆ",
    titleEn: "Communication between PLC and Other Devices",
    description:
      "ในระบบอัตโนมัติ การสื่อสารข้อมูลของ PLC มีบทบาทสำคัญในการเชื่อมโยงระหว่างหน่วยควบคุมกับอุปกรณ์อื่นในกระบวนการผลิต การสื่อสารแบบอนุกรม RS-232 เหมาะกับการเชื่อมต่อแบบ Point-to-Point ระยะสั้นไม่เกิน 15 เมตร ส่วน RS-485 รองรับ …",
    clo: "CLO2",
    hoursT: 2,
    hoursP: 3,
    topics: ["7.1 RS-232, RS-485", "7.2 Protocol Modbus", "7.3 V-net IoT"],
    labTitle: "การสื่อสารข้อมูลระหว่าง PLC กับอุปกรณ์ภายนอก",
    reviewSheet: "review_sheet_07.html",
    icon: "Network",
    color: "teal",
  },
  {
    id: "08",
    week: "10–13",
    titleTh: "การประยุกต์ใช้ PLC ควบคุมอุปกรณ์อื่น ๆ",
    titleEn: "PLC Applications for Controlling Devices",
    description:
      "การประยุกต์ใช้ PLC ควบคุมอุปกรณ์อื่น ๆ เป็นพื้นฐานสำคัญของระบบอัตโนมัติทางอุตสาหกรรม โดยประกอบด้วยอุปกรณ์ตรวจจับ (Sensors) เช่น Inductive, Capacitive, Photo Proximity Sensor, Fiber Optic Sensor และ Encoder …",
    clo: "CLO1",
    hoursT: 8,
    hoursP: 12,
    topics: ["8.1 Inductive Proximity Sensor", "8.2 Capacitive Proximity Sensor", "8.3 Photo Proximity Sensor", "8.4 Fiber Optic Sensor", "8.5 Encoder", "8.6 Tower Lamp", "8.7 Relay", "8.8 DC Motor", "8.9 Stepper Motor", "8.10 Servo Motor", "8.11 Solenoid Valve"],
    labTitle: "การประยุกต์ใช้ PLC ควบคุม Inverter และ Servo Motor",
    reviewSheet: "review_sheet_08.html",
    icon: "Cog",
    color: "indigo",
  },
  {
    id: "09",
    week: "14–15",
    titleTh: "การประยุกต์ใช้ PLC และ HMI ควบคุมงานทางด้านเมคคาทรอนิกส์",
    titleEn: "PLC and HMI Applications in Mechatronics",
    description:
      "การประยุกต์ใช้ PLC และ HMI ในการควบคุมงานทางด้านเมคคาทรอนิกส์ถือเป็นหัวใจสำคัญของอุตสาหกรรมยุค Industry 4.0 โดยระบบสายพานลำเลียง (Conveyor System) ใช้ PLC ควบคุมการเริ่ม-หยุดมอเตอร์ ตรวจจับวัตถุด้วย Sensor และนับจำนวนชิ้นงาน …",
    clo: "CLO2",
    hoursT: 4,
    hoursP: 6,
    topics: ["9.1 ระบบสายพานลำเลียง (Conveyor System)", "9.2 ระบบบรรจุผลิตภัณฑ์อัตโนมัติ (Automatic Packing System)"],
    labTitle: "การควบคุมระบบสายพานลำเลียงด้วย PLC และ HMI",
    reviewSheet: "review_sheet_09.html",
    icon: "Factory",
    color: "orange",
  },
  {
    id: "10",
    week: "16",
    titleTh: "การตรวจสอบและบำรุงรักษา PLC",
    titleEn: "PLC Troubleshooting and Maintenance",
    description:
      "การตรวจสอบและบำรุงรักษา PLC เป็นกระบวนการสำคัญที่ครอบคลุมทั้งการค้นหาและแก้ไขข้อผิดพลาด (Troubleshooting) การป้องกันความเสียหายจากปัจจัยแวดล้อม เช่น ไฟกระชาก ความร้อน ความชื้น และสัญญาณรบกวนทางไฟฟ้า …",
    clo: "CLO3",
    hoursT: 2,
    hoursP: 3,
    topics: ["10.1 การค้นหาและแก้ไขข้อผิดพลาด", "10.2 การป้องกันความเสียหาย", "10.3 การบำรุงรักษา PLC"],
    labTitle: "การตรวจสอบและบำรุงรักษา PLC",
    reviewSheet: "review_sheet_10.html",
    icon: "Wrench",
    color: "rose",
  },
];

export function getModuleById(id: string): ModuleData | undefined {
  return modules.find((m) => m.id === id);
}

export const colorMap: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  slate: { bg: "bg-slate-100 dark:bg-slate-800/40", text: "text-slate-700 dark:text-slate-300", border: "border-slate-200 dark:border-slate-700", accent: "from-slate-500 to-gray-500" },
  blue: { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-800", accent: "from-blue-500 to-cyan-500" },
  green: { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-700 dark:text-green-300", border: "border-green-200 dark:border-green-800", accent: "from-green-500 to-emerald-500" },
  yellow: { bg: "bg-yellow-50 dark:bg-yellow-900/20", text: "text-yellow-700 dark:text-yellow-300", border: "border-yellow-200 dark:border-yellow-800", accent: "from-yellow-500 to-orange-500" },
  red: { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-700 dark:text-red-300", border: "border-red-200 dark:border-red-800", accent: "from-red-500 to-pink-500" },
  purple: { bg: "bg-purple-50 dark:bg-purple-900/20", text: "text-purple-700 dark:text-purple-300", border: "border-purple-200 dark:border-purple-800", accent: "from-purple-500 to-violet-500" },
  teal: { bg: "bg-teal-50 dark:bg-teal-900/20", text: "text-teal-700 dark:text-teal-300", border: "border-teal-200 dark:border-teal-800", accent: "from-teal-500 to-cyan-500" },
  indigo: { bg: "bg-indigo-50 dark:bg-indigo-900/20", text: "text-indigo-700 dark:text-indigo-300", border: "border-indigo-200 dark:border-indigo-800", accent: "from-indigo-500 to-blue-500" },
  orange: { bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-700 dark:text-orange-300", border: "border-orange-200 dark:border-orange-800", accent: "from-orange-500 to-amber-500" },
  rose: { bg: "bg-rose-50 dark:bg-rose-900/20", text: "text-rose-700 dark:text-rose-300", border: "border-rose-200 dark:border-rose-800", accent: "from-rose-500 to-pink-500" },
};
