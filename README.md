# สื่อการสอนออนไลน์รายวิชาโปรแกรมเมเบิลลอจิกคอนโทรลเลอร์

> EN-132-006 Programmable Logic Controller (PLC) 3 (2-3-5) — Next.js e-Learning Site

เว็บไซต์สื่อการสอนออนไลน์ของรายวิชา EN-132-006 โปรแกรมเมเบิลลอจิกคอนโทรลเลอร์ 10 หน่วยเรียน
เนื้อหาทั้งหมดนำมาจาก **เอกสารประกอบการสอน EN-132-006** (ภาคการศึกษาที่ 2/2568) ได้แก่ ใบความรู้ แผนการจัดการเรียนรู้
ใบงานปฏิบัติ แบบฝึกหัดท้ายหน่วยพร้อมเฉลย แบบทดสอบก่อนเรียน/หลังเรียน และข้อมูลรายวิชา
โครงเว็บใช้ template จาก [EN-012-314-AI](https://github.com/babankbro/EN-012-314-AI)

## รันด้วย Docker (แนะนำ)

ต้องติดตั้ง [Docker Desktop](https://www.docker.com/products/docker-desktop/) ก่อน แล้วเปิด Terminal / PowerShell ในโฟลเดอร์นี้

```bash
docker compose up -d --build     # build และเปิดเว็บ → http://localhost:3000
docker compose logs -f           # ดู log
docker compose down              # หยุดเว็บ
```

แก้เนื้อหาใน `content/` แล้วสั่ง `docker compose up -d --build` อีกครั้งเพื่อ build ใหม่

หากไม่ใช้ compose:

```bash
docker build -t en-132-006-plc-elearning .
docker run -d -p 3000:3000 --name plc-elearning en-132-006-plc-elearning
```

## รันด้วย Node.js (สำหรับแก้ไขเนื้อหา)

ต้องใช้ Node.js 18.17 ขึ้นไป (แนะนำ 20)

```bash
npm install
npm run dev          # เปิด http://localhost:3000 (แก้ไฟล์แล้วรีเฟรชได้ทันที)
npm run check        # ตรวจความครบถ้วนและรูปแบบของเนื้อหา
npm run build && npm start
```

## หน่วยเรียน

| หน่วย | สัปดาห์ | ชื่อหน่วยเรียน | ท | ป | CLO | ใบงานปฏิบัติ |
|---|---|---|---|---|---|---|
| 1 | 1 | บทนำเกี่ยวกับโปรแกรมเมเบิลลอจิกคอนโทรลเลอร์ (PLC) | 2 | 3 | CLO3 | สำรวจโครงสร้าง ป้ายคุณลักษณะ และการเชื่อมต่อวงจรไฟฟ้าของ PLC |
| 2 | 2 | ระบบอินพุตและเอาต์พุตของ PLC | 2 | 3 | CLO3 | ต่อวงจรอุปกรณ์อินพุต/เอาต์พุตกับ PLC และทดสอบด้วยโหมด Monitor |
| 3 | 3 | การใช้งาน PLC | 2 | 3 | CLO1 | เชื่อมต่อ PLC กับคอมพิวเตอร์และใช้งาน GX Works3 |
| 4 | 4–5 | การเขียนโปรแกรมควบคุมด้วยคำสั่งพื้นฐาน | 4 | 6 | CLO1 | เขียนโปรแกรมควบคุมด้วยคำสั่งพื้นฐานของ PLC |
| 5 | 6 | บทนำเกี่ยวกับ HMI | 2 | 3 | CLO2 | เชื่อมต่อ HMI กับ PLC และใช้งาน GT Designer3 |
| 6 | 7 | การใช้งานพื้นฐาน HMI | 2 | 3 | CLO2 | ออกแบบหน้าจอควบคุมพื้นฐานด้วย HMI |
| 7 | 9 | การสื่อสารระหว่าง PLC กับอุปกรณ์อื่น ๆ | 2 | 3 | CLO2 | สื่อสารข้อมูลระหว่าง PLC กับอุปกรณ์ภายนอก |
| 8 | 10–13 | การประยุกต์ใช้ PLC ควบคุมอุปกรณ์อื่น ๆ | 8 | 12 | CLO1 | ควบคุม Inverter และ Servo Motor |
| 9 | 14–15 | การประยุกต์ใช้ PLC และ HMI ควบคุมงานเมคคาทรอนิกส์ | 4 | 6 | CLO2 | ควบคุมระบบสายพานลำเลียงด้วย PLC และ HMI |
| 10 | 16 | การตรวจสอบและบำรุงรักษา PLC | 2 | 3 | CLO3 | ตรวจสอบและบำรุงรักษา PLC |
| | | **รวม** | **30** | **45** | | |

## โครงสร้างโปรเจกต์

```
├── app/
│   ├── page.tsx                  ← หน้าหลัก (ภาพรวมรายวิชา + CLO)
│   ├── course-info/page.tsx      ← ข้อมูลรายวิชา (content/course-info.md)
│   ├── module/[id]/page.tsx      ← ใบความรู้ + จุดประสงค์ + แบบฝึกหัดพร้อมเฉลย
│   ├── plan/[id]/page.tsx        ← แผนการจัดการเรียนรู้ประจำหน่วย
│   ├── lab/[id]/page.tsx         ← ใบงานปฏิบัติ (พิมพ์/บันทึก PDF ได้)
│   ├── exam/[kind]/[id]/page.tsx ← แบบทดสอบก่อนเรียน (pre) / หลังเรียน (post)
│   └── api/content/[...path]/    ← ให้บริการไฟล์ใน content/ (Review Sheet)
├── components/                   ← Header, Sidebar, MarkdownContent, ExamClient, PrintButton ฯลฯ
├── lib/
│   ├── course.ts                 ← ข้อมูลรายวิชาและ CLOs
│   ├── modules-data.ts           ← ข้อมูล 10 หน่วย (สัปดาห์ ชั่วโมง ท/ป CLO หัวข้อ)
│   ├── exam-types.ts             ← ชนิดข้อมูลแบบทดสอบ
│   └── content.ts                ← อ่าน markdown / exam JSON
├── content/
│   ├── course-info.md            ← ข้อมูลรายวิชา
│   ├── modules/module-XX.md      ← ใบความรู้
│   ├── plans/plan-XX.md          ← แผนการจัดการเรียนรู้
│   ├── labs/lab-XX.md            ← ใบงานปฏิบัติ
│   ├── exams/pre-XX.json         ← แบบทดสอบก่อนเรียน 10 ข้อ
│   ├── exams/post-XX.json        ← แบบทดสอบหลังเรียน 10 ข้อ
│   └── SHEET/review_sheet_XX.html← แบบทบทวน 1 หน้า A4
├── public/images/book/           ← รูปประกอบจากเอกสารประกอบการสอน
├── Dockerfile · docker-compose.yml
└── CONTENT_GUIDE.md              ← คู่มือแก้ไขเนื้อหา
```

## ฟีเจอร์

- **Docs-style Layout** — Sidebar + Content, Dark/Light Mode, ค้นหา (Ctrl+K), Responsive
- **ใบความรู้** พร้อมรูปประกอบ ตาราง จุดประสงค์การสอน แบบฝึกหัดท้ายหน่วย (กดดูเฉลยได้) และบรรณานุกรม APA 7
- **แผนการจัดการเรียนรู้** และ **ใบงานปฏิบัติ** — พิมพ์หรือบันทึกเป็น PDF ได้
- **แบบทดสอบก่อนเรียน/หลังเรียน** หน่วยละ 10 ข้อ 5 ตัวเลือก จับเวลา ตรวจอัตโนมัติ แสดงเฉลย และพิมพ์ผลได้ (เกณฑ์ผ่านร้อยละ 50)
- **Review Sheet** สรุป 1 หน้า A4 ต่อหน่วย

## เทคโนโลยี

Next.js 14 (App Router, output standalone) · TailwindCSS · react-markdown + remark-gfm + rehype-raw · Lucide React · ฟอนต์ Prompt (@fontsource, ไม่ต้องโหลดจาก Google ตอน build)

---

**ผู้จัดทำ:** อาจารย์ศิวณุ เหล่าบุตรสา  
**สาขาวิชา:** วิศวกรรมเครื่องกลและเมคคาทรอนิกส์ คณะวิศวกรรมศาสตร์และเทคโนโลยีอุตสาหกรรม มหาวิทยาลัยกาฬสินธุ์  
**ภาคการศึกษา:** 2/2568
