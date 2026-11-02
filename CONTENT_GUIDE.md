# คู่มือแก้ไขเนื้อหา (Content Authoring Guide)

เนื้อหาทุกหน่วยอยู่ในโฟลเดอร์ `content/` — เมื่อรันด้วย `npm run dev` แก้ไฟล์แล้วรีเฟรชหน้าเว็บได้เลย
เมื่อรันด้วย Docker ให้สั่ง `docker compose up -d --build` อีกครั้งหลังแก้

แต่ละหน่วย `XX` (01–10) ประกอบด้วย

| ไฟล์ | หน้าที่ | แสดงที่ |
|---|---|---|
| `content/modules/module-XX.md` | ใบความรู้ (จุดประสงค์การสอน เนื้อหา บทสรุป แบบฝึกหัดพร้อมเฉลย บรรณานุกรม) | `/module/XX` |
| `content/examples/example-XX.md` | ตัวอย่างโจทย์และวิธีทำ (แทรกก่อน "แบบฝึกหัดท้ายหน่วยเรียน" อัตโนมัติ) | `/module/XX` |
| `content/plans/plan-XX.md` | แผนการจัดการเรียนรู้ | `/plan/XX` |
| `content/labs/lab-XX.md` | สรุปแผนการสอนประจำหน่วย + ใบงานปฏิบัติ | `/lab/XX` |
| `content/exams/pre-XX.json` | แบบทดสอบก่อนเรียน 10 ข้อ | `/exam/pre/XX` |
| `content/exams/post-XX.json` | แบบทดสอบหลังเรียน 10 ข้อ | `/exam/post/XX` |
| `content/SHEET/review_sheet_XX.html` | แบบทบทวน 1 หน้า A4 | `/api/content/SHEET/review_sheet_XX.html` |

ข้อมูลหน่วย (ชื่อ สัปดาห์ ชั่วโมง ท/ป CLO หัวข้อ) อยู่ที่ `lib/modules-data.ts` และข้อมูลรายวิชา/CLO อยู่ที่ `lib/course.ts`

## Markdown ที่รองรับ

| ต้องการ | เขียนแบบนี้ |
|---|---|
| หัวข้อ | `## 1.1 หัวข้อ` / `### หัวข้อย่อย` (ไม่ต้องมี `#` H1 — หน้าเว็บแสดงชื่อหน่วยให้แล้ว) |
| ตาราง | GFM table หรือ HTML `<table>` (รองรับ rowspan/colspan) |
| รูปภาพ | `![ภาพที่ 1.1 คำบรรยาย](/images/book/image1.jpg)` — ข้อความใน `[...]` แสดงเป็นคำบรรยายใต้ภาพ |
| เฉลยซ่อน | `<details><summary>เฉลย</summary>`(บรรทัดว่าง)เนื้อหา(บรรทัดว่าง)`</details>` |
| กล่องเน้น | `> [!NOTE]`, `> [!TIP]`, `> [!WARNING]` |
| ลิงก์ไปหน่วยอื่น | `[หน่วยที่ 3](/module/03)` |

รูปใหม่ให้วางใน `public/images/book/` (หรือโฟลเดอร์ย่อยใหม่) แล้วอ้างด้วย path ที่ขึ้นต้นด้วย `/images/`

## แบบทดสอบ `pre-XX.json` / `post-XX.json`

```json
{
  "moduleId": "02",
  "kind": "post",
  "title": "PLC Input and Output Systems",
  "titleTh": "ระบบอินพุตและเอาต์พุตของ PLC",
  "timeMinutes": 15,
  "questions": [
    {
      "id": 1,
      "question": "ข้อความคำถาม",
      "choices": [
        { "key": "ก", "text": "..." },
        { "key": "ข", "text": "..." },
        { "key": "ค", "text": "..." },
        { "key": "ง", "text": "..." },
        { "key": "จ", "text": "..." }
      ],
      "answer": "ข",
      "explanation": "คำตอบที่ถูกต้องคือ ข้อ ข. ..."
    }
  ]
}
```

- หน่วยละ 10 ข้อ 5 ตัวเลือก (ก–จ) ตรงกับเอกสารประกอบการสอน คำตอบกระจายแบบสุ่ม
- แก้คำถามหรือเฉลยในเว็บแล้ว ควรแก้ในเอกสารประกอบการสอนให้ตรงกันด้วย

## ตรวจเนื้อหา

```bash
npm run check   # ตรวจไฟล์ครบ, JSON แบบทดสอบ, ตัวเลือก ก–จ, การกระจายคำตอบ, รูปภาพ
```

## Infographic

ภาพอยู่ที่ `public/images/infographic/*.png` สร้างจากโค้ด `scripts/infographics/figures.py` (เขียน SVG) แล้วแปลงเป็น PNG ด้วยฟอนต์ Prompt:

```bash
python3 scripts/infographics/figures.py
npm i -D playwright && npx playwright install chromium   # ครั้งแรกครั้งเดียว
node scripts/infographics/render.mjs
```
