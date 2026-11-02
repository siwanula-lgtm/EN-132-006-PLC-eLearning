# สร้าง infographic (SVG) ประกอบตัวอย่างโจทย์ของแต่ละหน่วยเรียน
# รัน: python3 scripts/infographics/figures.py  แล้ว  node scripts/infographics/render.mjs  (แปลงเป็น PNG ด้วยฟอนต์ Prompt)
import os, html

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "svg")
os.makedirs(OUT, exist_ok=True)

NAVY, BLUE, CYAN, GREEN, ORANGE, RED, GRAY, INK = "#0c3b6e", "#1769aa", "#0891b2", "#15803d", "#c2410c", "#b91c1c", "#64748b", "#1e293b"
LBLUE, LCYAN, LGREEN, LORANGE, LRED, LGRAY, LYEL = "#e8f1fb", "#e0f5f9", "#e7f6ec", "#fdeee4", "#fde8e8", "#f1f5f9", "#fef9e1"


class Fig:
    def __init__(self, w, h, title, sub=""):
        self.w, self.h, self.el = w, h, []
        self.rect(0, 0, w, h, "#ffffff", "none", r=0)
        self.rect(0, 0, w, 64, NAVY, "none", r=0)
        self.text(28, 41, title, 26, "#ffffff", weight=600, anchor="start")
        if sub:
            self.text(w - 28, 41, sub, 16, "#cfe3f3", anchor="end")

    def rect(self, x, y, w, h, fill, stroke=GRAY, r=12, sw=2, dash=None):
        d = f' stroke-dasharray="{dash}"' if dash else ""
        self.el.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{d}/>')

    def text(self, x, y, s, size=18, color=INK, weight=400, anchor="middle"):
        self.el.append(f'<text x="{x}" y="{y}" font-size="{size}" fill="{color}" font-weight="{weight}" text-anchor="{anchor}">{html.escape(str(s))}</text>')

    def lines(self, x, y, arr, size=18, color=INK, weight=400, anchor="middle", gap=None):
        gap = gap or size * 1.45
        for i, s in enumerate(arr):
            self.text(x, y + i * gap, s, size, color, weight, anchor)

    def box(self, x, y, w, h, title, body=(), fill=LBLUE, stroke=BLUE, tsize=20, bsize=16):
        self.rect(x, y, w, h, fill, stroke)
        n = 1 + len(body)
        top = y + h / 2 - (n - 1) * bsize * 0.75 + 6
        self.text(x + w / 2, top, title, tsize, stroke if stroke != GRAY else INK, 600)
        self.lines(x + w / 2, top + tsize * 1.3, body, bsize, INK)

    def line(self, x1, y1, x2, y2, color=INK, sw=2.5, dash=None, arrow=False):
        d = f' stroke-dasharray="{dash}"' if dash else ""
        m = ' marker-end="url(#ah)"' if arrow else ""
        self.el.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{sw}"{d}{m}/>')

    def poly(self, pts, color=INK, sw=3, fill="none", arrow=False):
        p = " ".join(f"{a},{b}" for a, b in pts)
        m = ' marker-end="url(#ah)"' if arrow else ""
        self.el.append(f'<polyline points="{p}" fill="{fill}" stroke="{color}" stroke-width="{sw}" stroke-linejoin="round"{m}/>')

    def circle(self, x, y, r, fill, stroke=GRAY, sw=2):
        self.el.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')

    def pill(self, x, y, s, fill=BLUE, color="#fff", size=15, w=None):
        w = w or (len(s) * size * 0.62 + 24)
        self.rect(x - w / 2, y - size, w, size * 1.8, fill, "none", r=size)
        self.text(x, y + size * 0.35, s, size, color, 600)

    def footer(self, s):
        self.text(self.w / 2, self.h - 16, s, 14, GRAY)

    # ---- ladder helpers ----
    def rails(self, x1, x2, y1, y2):
        self.line(x1, y1, x1, y2, INK, 4)
        self.line(x2, y1, x2, y2, INK, 4)

    def contact(self, x, y, label, nc=False, color=INK):
        self.line(x - 22, y, x - 8, y, color, 3)
        self.line(x + 8, y, x + 22, y, color, 3)
        self.line(x - 8, y - 18, x - 8, y + 18, color, 3)
        self.line(x + 8, y - 18, x + 8, y + 18, color, 3)
        if nc:
            self.line(x - 14, y + 18, x + 14, y - 18, color, 3)
        self.text(x, y - 28, label, 17, color, 600)

    def coil(self, x, y, label, color=INK, inner=""):
        self.el.append(f'<path d="M{x-6},{y-18} A22,22 0 0,0 {x-6},{y+18}" fill="none" stroke="{color}" stroke-width="3"/>')
        self.el.append(f'<path d="M{x+6},{y-18} A22,22 0 0,1 {x+6},{y+18}" fill="none" stroke="{color}" stroke-width="3"/>')
        if inner:
            self.text(x, y + 6, inner, 13, color, 600)
        self.text(x, y - 28, label, 17, color, 600)

    def svg(self):
        defs = ('<defs><marker id="ah" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="userSpaceOnUse">'
                f'<path d="M0,0 L12,6 L0,12 z" fill="{INK}"/></marker></defs>')
        return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" viewBox="0 0 {self.w} {self.h}" '
                f'font-family="Prompt, Sarabun, Tahoma, sans-serif">{defs}' + "".join(self.el) + "</svg>")

    def save(self, name):
        open(os.path.join(OUT, name + ".svg"), "w", encoding="utf8").write(self.svg())


def wave(f, x0, y, w, segs, hi=40, color=BLUE, label=""):
    """segs = list of (level 0/1, length fraction)"""
    pts, x = [], x0
    lvl = segs[0][0]
    pts.append((x, y - hi * lvl))
    for l, frac in segs:
        if l != lvl:
            pts.append((x, y - hi * lvl)); pts.append((x, y - hi * l)); lvl = l
        x += w * frac
        pts.append((x, y - hi * lvl))
    f.poly(pts, color, 3)
    if label:
        f.text(x0 - 16, y - hi / 2 + 6, label, 18, INK, 600, "end")


# ===================== หน่วยที่ 1 =====================
f = Fig(1200, 640, "โครงสร้าง PLC และวงรอบการสแกน (Scan Cycle)", "หน่วยที่ 1")
f.box(40, 120, 220, 150, "อุปกรณ์อินพุต", ["Push Button", "Limit Switch", "Sensor"], LGREEN, GREEN)
f.box(330, 100, 170, 190, "Input Unit", ["X0, X1, X2 …", "แยกวงจรด้วย", "Photocoupler"], LCYAN, CYAN, bsize=15)
f.box(560, 90, 230, 210, "CPU + Memory", ["ประมวลผลโปรแกรม", "Ladder (LD)", "Device: X Y M D T C"], LBLUE, BLUE)
f.box(850, 100, 170, 190, "Output Unit", ["Y0, Y1, Y2 …", "Relay / Transistor", "/ Triac"], LCYAN, CYAN, bsize=15)
f.box(1040, 120, 140, 150, "โหลด", ["คอนแทกเตอร์", "หลอดไฟ", "โซลินอยด์"], LORANGE, ORANGE, bsize=15)
for a, b in ((260, 330), (500, 560), (790, 850), (1020, 1040)):
    f.line(a, 195, b - 4, 195, INK, 3, arrow=True)
f.box(560, 320, 230, 60, "Power Supply 24 VDC", [], LGRAY, GRAY, tsize=17)
f.line(675, 320, 675, 304, GRAY, 2, arrow=True)
# scan cycle
cx, cy, r = 600, 510, 78
f.circle(cx, cy, r, "none", BLUE, 4)
steps = [("1 อ่านสถานะอินพุต", cx - 290, cy - 30), ("2 ประมวลผลโปรแกรม", cx + 290, cy - 30),
         ("3 ส่งค่าออกเอาต์พุต", cx + 290, cy + 55), ("4 ตรวจสอบตัวเอง/สื่อสาร", cx - 290, cy + 55)]
for s, x, y in steps:
    f.pill(x, y, s, BLUE, "#fff", 17)
f.text(cx, cy - 8, "1 Scan", 22, BLUE, 700)
f.text(cx, cy + 22, "≈ 0.1–10 ms", 16, GRAY)
f.footer("PLC ทำงานวนซ้ำ 1 → 2 → 3 → 4 ตลอดเวลาในโหมด RUN — เวลาตอบสนองสูงสุด ≈ 2 Scan + เวลากรองสัญญาณอินพุต")
f.save("u01_plc_scan")

f = Fig(1200, 620, "การต่ออินพุตแบบ Sink และ Source (FX5U)", "หน่วยที่ 1")
for i, (name, sens, ss, col, lc, note) in enumerate([
        ("Sink Input", "เซนเซอร์ NPN", "S/S ต่อ +24V", BLUE, LBLUE, "กระแสไหลออกจากขา X ผ่านเซนเซอร์ลง 0V"),
        ("Source Input", "เซนเซอร์ PNP", "S/S ต่อ 0V", ORANGE, LORANGE, "กระแสไหลจากเซนเซอร์ (+24V) เข้าขา X")]):
    x0 = 40 + i * 590
    f.rect(x0, 90, 530, 450, lc, col)
    f.text(x0 + 265, 128, name, 26, col, 700)
    f.box(x0 + 30, 170, 170, 230, "PLC", ["S/S", "", "X0", "", "COM"], "#ffffff", col, bsize=18)
    f.box(x0 + 330, 170, 170, 110, sens, ["(3 สาย)"], "#ffffff", col, tsize=19)
    f.box(x0 + 330, 320, 170, 80, "แหล่งจ่าย", ["24 VDC"], "#ffffff", GRAY, tsize=17)
    f.line(x0 + 200, 222, x0 + 330, 222 if i == 0 else 222, RED if i == 0 else INK, 3)
    f.text(x0 + 265, 214, "+24V" if i == 0 else "0V", 15, RED if i == 0 else INK, 600)
    if i == 0:
        f.line(x0 + 200, 284, x0 + 326, 252, col, 3, arrow=True)   # Sink: กระแสออกจาก X ไปเซนเซอร์
    else:
        f.line(x0 + 330, 250, x0 + 204, 283, col, 3, arrow=True)   # Source: กระแสจากเซนเซอร์เข้า X
    f.text(x0 + 265, 296, "สัญญาณ", 15, col, 600)
    f.line(x0 + 415, 280, x0 + 415, 320, INK, 3)
    f.pill(x0 + 265, 450, ss, col, "#fff", 17)
    f.lines(x0 + 265, 500, [note], 16)
f.footer("จำง่าย: NPN → Sink (S/S ไป +24V)   |   PNP → Source (S/S ไป 0V)   — ตรวจขั้วก่อนจ่ายไฟทุกครั้ง")
f.save("u01_sink_source")

# ===================== หน่วยที่ 2 =====================
f = Fig(1200, 600, "หน้าสัมผัส NO / NC กับสถานะใน Ladder", "หน่วยที่ 2")
heads = ["", "ไม่กดปุ่ม (ปกติ)", "กดปุ่ม", "ใช้กับงาน"]
xs = [150, 450, 720, 1000]
for x, h in zip(xs, heads):
    f.text(x, 130, h, 20, NAVY, 700)
rows = [("NO (Normally Open)", "วงจรเปิด → X0 = OFF", "วงจรปิด → X0 = ON", "ปุ่ม Start, เซนเซอร์ตรวจจับ", BLUE, LBLUE),
        ("NC (Normally Closed)", "วงจรปิด → X1 = ON", "วงจรเปิด → X1 = OFF", "ปุ่ม Stop, Emergency", RED, LRED)]
for i, (a, b, c, d, col, lc) in enumerate(rows):
    y = 170 + i * 180
    f.rect(40, y, 1120, 150, lc, col)
    f.text(150, y + 70, a.split(" (")[0], 30, col, 700)
    f.text(150, y + 104, "(" + a.split(" (")[1], 15, col)
    for x, s in ((450, b), (720, c), (1000, d)):
        f.lines(x, y + 84, [s], 17)
f.pill(600, 545, "ปุ่ม Stop ใช้ NC เพื่อความปลอดภัย: ถ้าสายขาด PLC จะเห็นเป็นการกด Stop ทันที (Fail-safe)", ORANGE, "#fff", 16, 900)
f.save("u02_no_nc")

f = Fig(1200, 560, "สัญญาณ Rotary Encoder เฟส A / B / Z", "หน่วยที่ 2")
period = 0.125
segA = [(1, period / 2), (0, period / 2)] * 7 + [(1, period / 2)]
wave(f, 170, 190, 900, [(0, period / 4)] + segA[:-1], 50, BLUE, "A")
wave(f, 170, 290, 900, [(0, period / 2)] + segA[:-2] + [(1, period / 4)], 50, ORANGE, "B")
wave(f, 170, 390, 900, [(0, 0.47), (1, 0.06), (0, 0.47)], 50, GREEN, "Z")
f.line(170 + 900 * period / 4, 120, 170 + 900 * period / 4, 410, GRAY, 1.5, dash="6 6")
f.line(170 + 900 * period / 2, 120, 170 + 900 * period / 2, 410, GRAY, 1.5, dash="6 6")
f.text(170 + 900 * 0.19, 112, "ต่างเฟส 90°", 15, GRAY)
f.lines(600, 450, ["A นำ B → หมุนตามเข็ม (CW)   |   B นำ A → หมุนทวนเข็ม (CCW)",
                   "Z = 1 พัลส์/รอบ ใช้เป็นจุดอ้างอิง   |   นับ 4 ขอบ (×4) ได้ละเอียดขึ้น 4 เท่า"], 18)
f.save("u02_encoder")

# ===================== หน่วยที่ 3 =====================
f = Fig(1200, 520, "ขั้นตอนใช้งาน GX Works3 ตั้งแต่สร้างโปรเจกต์จนถึง Monitor", "หน่วยที่ 3")
steps = [("1", "New Project", ["Series: FX5CPU", "Type: FX5U"]), ("2", "เขียน Ladder", ["วาดหน้าสัมผัส", "และคอยล์"]),
         ("3", "Convert", ["กด F4", "ตรวจไวยากรณ์"]), ("4", "เชื่อมต่อ", ["Ethernet / USB", "Connection Test"]),
         ("5", "Write to PLC", ["เขียนโปรแกรม", "+ พารามิเตอร์"]), ("6", "RUN + Monitor", ["สวิตช์ RUN", "Monitor F3"])]
for i, (n, t, b) in enumerate(steps):
    x = 30 + i * 195
    f.box(x, 150, 170, 200, t, b, LBLUE if i % 2 == 0 else LCYAN, BLUE if i % 2 == 0 else CYAN, tsize=19)
    f.circle(x + 85, 150, 22, NAVY, NAVY)
    f.text(x + 85, 158, n, 20, "#fff", 700)
    if i < 5:
        f.line(x + 170, 250, x + 193, 250, INK, 3, arrow=True)
f.pill(600, 420, "แก้โปรแกรมขณะ Monitor: เปลี่ยนเป็น Edit → แก้ไข → Convert (F4) → Write ใหม่", ORANGE, "#fff", 17, 820)
f.footer("ทุกครั้งที่แก้ Ladder ต้อง Convert ก่อน มิฉะนั้นจะ Write to PLC ไม่ได้")
f.save("u03_workflow")

f = Fig(1200, 500, "การกำหนดแอดเดรส X / Y ของ FX5U เป็นเลขฐานแปด (Octal)", "หน่วยที่ 3")
for r_, pre in enumerate(("X", "Y")):
    for row in range(2):
        for k in range(8):
            n = row * 8 + k
            lab = f"{pre}{oct(n)[2:]}"
            x, y = 120 + k * 125, 120 + (r_ * 2 + row) * 70
            f.rect(x, y, 110, 54, LBLUE if pre == "X" else LORANGE, BLUE if pre == "X" else ORANGE, r=8)
            f.text(x + 55, y + 35, lab, 20, INK, 600)
    f.text(70, 120 + r_ * 140 + 75, "อินพุต" if pre == "X" else "เอาต์พุต", 18, BLUE if pre == "X" else ORANGE, 700)
f.pill(600, 440, "ไม่มี X8, X9 — นับ X7 แล้วต่อด้วย X10   |   อินพุตตัวที่ 20 = 19 ฐานสิบ = X23", NAVY, "#fff", 18, 860)
f.save("u03_octal")

# ===================== หน่วยที่ 4 =====================
f = Fig(1200, 560, "วงจร Self Holding (Start / Stop มอเตอร์)", "หน่วยที่ 4")
f.rails(110, 1090, 120, 400)
y = 200
f.line(110, y, 230, y); f.contact(252, y, "X0 Start"); f.line(274, y, 430, y)
f.contact(452, y, "X1 Stop", nc=True); f.line(474, y, 960, y); f.coil(982, y, "Y0 มอเตอร์"); f.line(1004, y, 1090, y)
y2 = 320
f.line(200, y, 200, y2); f.line(200, y2, 230, y2); f.contact(252, y2, "Y0", color=GREEN); f.line(274, y2, 320, y2); f.line(320, y2, 320, y)
f.text(252, y2 + 52, "หน้าสัมผัสค้างสถานะ (Seal-in)", 16, GREEN, 600)
f.lines(600, 440, ["กด X0 → Y0 ON → หน้าสัมผัส Y0 ต่อขนาน X0 ทำให้ Y0 ค้างอยู่แม้ปล่อยปุ่ม",
                   "กด X1 (NC) → วงจรขาด → Y0 OFF   |   Stop อยู่ก่อนคอยล์เสมอ = Stop ชนะ (Stop priority)"], 18)
f.save("u04_self_holding")

f = Fig(1200, 600, "วงจรกลับทางหมุนมอเตอร์พร้อม Interlock", "หน่วยที่ 4")
f.rails(80, 1120, 110, 480)
for i, (st, me, other, nm) in enumerate((("X0 FWD", "Y0", "Y1", "Y0 เดินหน้า"), ("X1 REV", "Y1", "Y0", "Y1 ถอยหลัง"))):
    y = 190 + i * 170
    f.line(80, y, 190, y); f.contact(212, y, st); f.line(234, y, 360, y)
    f.contact(382, y, "X2 Stop", nc=True); f.line(404, y, 560, y)
    f.contact(582, y, other, nc=True, color=RED); f.line(604, y, 960, y)
    f.coil(982, y, nm); f.line(1004, y, 1120, y)
    y2 = y + 80
    f.line(160, y, 160, y2); f.line(160, y2, 190, y2); f.contact(212, y2, me, color=GREEN); f.line(234, y2, 280, y2); f.line(280, y2, 280, y)
f.pill(600, 545, "หน้าสัมผัส NC ของอีกทิศ (สีแดง) กัน Y0 และ Y1 ทำงานพร้อมกัน → ป้องกันไฟลัดวงจรที่คอนแทกเตอร์", RED, "#fff", 16, 900)
f.save("u04_interlock")

f = Fig(1200, 560, "Timing Diagram ของ Timer แบบหน่วงเวลา ON (T0 K50 = 5.0 วินาที)", "หน่วยที่ 4")
wave(f, 220, 170, 900, [(0, 0.08), (1, 0.62), (0, 0.30)], 50, BLUE, "X0 (สั่งงาน)")
f.text(204, 271, "ค่าปัจจุบัน T0", 18, INK, 600, "end")
f.poly([(220, 290), (220 + 900 * 0.08, 290), (220 + 900 * 0.53, 240), (220 + 900 * 0.70, 240), (220 + 900 * 0.70, 290), (1120, 290)], GRAY, 3)
f.text(220 + 900 * 0.615, 230, "K50", 15, GRAY, 600)
wave(f, 220, 410, 900, [(0, 0.08 + 0.45), (1, 0.17), (0, 0.30)], 50, GREEN, "T0 / Y0")
x1, x2 = 220 + 900 * 0.08, 220 + 900 * 0.53
f.line(x1, 440, x1, 120, GRAY, 1.5, dash="6 6"); f.line(x2, 440, x2, 120, GRAY, 1.5, dash="6 6")
f.line(x1 + 4, 460, x2 - 4, 460, INK, 2, arrow=True)
f.pill((x1 + x2) / 2, 495, "50 × 0.1 s = 5.0 s", ORANGE, "#fff", 17)
f.lines(940, 470, ["X0 OFF ก่อนครบเวลา", "→ T0 รีเซตค่าเป็น 0"], 16)
f.save("u04_timer")

# ===================== หน่วยที่ 5 =====================
f = Fig(1200, 520, "เครือข่าย PLC – HMI – คอมพิวเตอร์ผ่าน Ethernet", "หน่วยที่ 5")
f.box(470, 120, 260, 90, "Switching Hub", [], LGRAY, GRAY)
for x, t, ip, col, lc in ((60, "คอมพิวเตอร์", "192.168.3.10", BLUE, LBLUE), (470, "PLC FX5U", "192.168.3.250", GREEN, LGREEN),
                          (880, "HMI (GOT)", "192.168.3.18", ORANGE, LORANGE)):
    f.box(x, 300, 260, 130, t, [ip, "Subnet 255.255.255.0"], lc, col, bsize=16)
    f.line(x + 130, 300, 600, 210, INK, 2.5)
f.lines(600, 475, ["ทุกอุปกรณ์ต้องอยู่วงเดียวกัน (192.168.3.x) และ IP ห้ามซ้ำ"], 18)
f.save("u05_network")

# ===================== หน่วยที่ 6 =====================
f = Fig(1200, 580, "การสเกลค่าอนาล็อกเพื่อแสดงบน Numerical Display", "หน่วยที่ 6")
ox, oy, gw, gh = 140, 470, 620, 360
f.line(ox, oy, ox + gw + 20, oy, INK, 3, arrow=True); f.line(ox, oy, ox, oy - gh - 20, INK, 3, arrow=True)
f.line(ox, oy, ox + gw, oy - gh, BLUE, 4)
px, py = ox + gw * 2500 / 4000, oy - gh * 62.5 / 100
f.line(px, oy, px, py, ORANGE, 2, dash="6 6"); f.line(ox, py, px, py, ORANGE, 2, dash="6 6")
f.circle(px, py, 8, ORANGE, ORANGE)
f.text(px, oy + 30, "2500", 17, ORANGE, 700); f.text(ox - 12, py + 6, "62.5", 17, ORANGE, 700, "end")
f.text(ox + gw, oy + 30, "4000", 16); f.text(ox - 12, oy - gh + 6, "100.0", 16, INK, 400, "end")
f.text(ox + gw / 2, oy + 62, "ค่าดิบจากโมดูลอนาล็อก (D100)", 17, INK, 600)
f.text(ox - 70, oy - gh - 30, "อุณหภูมิ °C", 17, INK, 600, "start")
f.box(820, 140, 340, 330, "สูตรสเกลเชิงเส้น", ["ค่าจริง = ค่าดิบ × (100 − 0)", "             ÷ (4000 − 0)", "", "2500 × 100 ÷ 4000 = 62.5 °C", "",
                                             "เก็บใน D110 = 625", "ตั้ง Decimal = 1 → แสดง 62.5"], LBLUE, BLUE, bsize=17)
f.save("u06_scaling")

f = Fig(1200, 560, "โหมดการทำงานของ Bit Switch บน HMI", "หน่วยที่ 6")
wave(f, 300, 150, 820, [(0, 0.1), (1, 0.15), (0, 0.25), (1, 0.15), (0, 0.35)], 40, GRAY, "การกดปุ่ม")
wave(f, 300, 240, 820, [(0, 0.1), (1, 0.15), (0, 0.25), (1, 0.15), (0, 0.35)], 40, BLUE, "Momentary")
wave(f, 300, 330, 820, [(0, 0.1), (1, 0.4), (0, 0.5)], 40, GREEN, "Alternate")
wave(f, 300, 420, 820, [(0, 0.1), (1, 0.9)], 40, ORANGE, "Set")
wave(f, 300, 510, 820, [(1, 0.1), (0, 0.9)], 40, RED, "Reset")
f.save("u06_switch_modes")

# ===================== หน่วยที่ 7 =====================
f = Fig(1200, 560, "โครงสร้างเฟรม Modbus RTU: อ่าน Holding Register", "หน่วยที่ 7")
fields = [("Slave ID", "01", LGRAY), ("Function", "03", LBLUE), ("Start Hi", "00", LCYAN), ("Start Lo", "00", LCYAN),
          ("Qty Hi", "00", LGREEN), ("Qty Lo", "02", LGREEN), ("CRC Lo", "C4", LORANGE), ("CRC Hi", "0B", LORANGE)]
for i, (n, v, c) in enumerate(fields):
    x = 60 + i * 135
    f.rect(x, 140, 125, 130, c, GRAY, r=8)
    f.text(x + 62, 190, v, 34, INK, 700)
    f.text(x + 62, 240, n, 16, GRAY, 600)
f.lines(600, 330, ["Master ขอ: อ่านจาก Slave 1, ฟังก์ชัน 03, เริ่ม Register 0, จำนวน 2 ตัว"], 19, NAVY, 600)
f.lines(600, 390, ["Slave ตอบ: 01 03 04 00 64 01 F4 BB FB",
                   "→ Register 0 = 0064h = 100   |   Register 1 = 01F4h = 500"], 18)
f.footer("ระหว่างเฟรมต้องเว้นเงียบ ≥ 3.5 ตัวอักษร (≈ 3.65 ms ที่ 9600 bps) — CRC ส่งไบต์ต่ำก่อน")
f.save("u07_modbus")

f = Fig(1200, 560, "เปรียบเทียบ RS-232 และ RS-485", "หน่วยที่ 7")
f.rect(40, 90, 540, 410, LBLUE, BLUE); f.text(310, 130, "RS-232 (จุดต่อจุด)", 24, BLUE, 700)
f.box(80, 190, 160, 90, "PC", [], "#fff", BLUE); f.box(380, 190, 160, 90, "PLC", [], "#fff", BLUE)
f.line(240, 220, 380, 220, BLUE, 3, arrow=True); f.line(380, 252, 244, 252, BLUE, 3); f.text(310, 212, "TX → RX", 14, BLUE)
f.lines(310, 350, ["1 : 1 เท่านั้น", "ระยะ ≈ 15 m", "สัญญาณอ้างอิงกราวด์ (Single-ended)"], 18)
f.rect(620, 90, 540, 410, LORANGE, ORANGE); f.text(890, 130, "RS-485 (หลายจุด)", 24, ORANGE, 700)
f.line(660, 230, 1120, 230, ORANGE, 4); f.line(660, 260, 1120, 260, ORANGE, 4)
f.text(645, 236, "A", 16, ORANGE, 700, "end"); f.text(645, 266, "B", 16, ORANGE, 700, "end")
for i, t in enumerate(("Master", "Slave 1", "Slave 2", "Slave 3")):
    x = 690 + i * 110
    f.box(x, 160, 90, 50, t, [], "#fff", ORANGE, tsize=14); f.line(x + 45, 210, x + 45, 260, ORANGE, 2)
f.rect(1110, 222, 30, 46, "#fff", RED, r=4); f.text(1125, 292, "120Ω", 13, RED, 600)
f.lines(890, 350, ["สูงสุด 32 อุปกรณ์ต่อบัส", "ระยะ ≈ 1,200 m", "แบบดิฟเฟอเรนเชียล ทนสัญญาณรบกวน"], 18)
f.footer("ใช้สายคู่บิดเกลียว (Twisted pair) และต่อตัวต้านทาน 120 Ω ที่ปลายบัสทั้งสองด้าน")
f.save("u07_rs232_485")

# ===================== หน่วยที่ 8 =====================
f = Fig(1200, 560, "การสั่ง Stepper Motor ด้วยพัลส์ (Pulse / Direction)", "หน่วยที่ 8")
wave(f, 230, 170, 640, [(0, 0.05)] + [(1, 0.05), (0, 0.05)] * 9 + [(0, 0.05)], 50, BLUE, "PULSE (Y0)")
wave(f, 230, 290, 640, [(0, 0.05), (1, 0.95)], 50, ORANGE, "DIR (Y2)")
f.text(550, 340, "จำนวนพัลส์ = ระยะ/มุมที่หมุน   |   ความถี่พัลส์ = ความเร็ว", 17, INK, 600)
f.box(900, 110, 270, 250, "สูตรสำคัญ", ["พัลส์/รอบ = 360° ÷ มุมสเต็ป", "              × ไมโครสเต็ป", "", "ความถี่ (Hz) =",
                                       "rpm ÷ 60 × พัลส์/รอบ"], LBLUE, BLUE, bsize=16)
f.pill(600, 420, "1.8° × 1/8 สเต็ป → 1,600 พัลส์/รอบ   |   120 rpm → 3,200 Hz", NAVY, "#fff", 18, 760)
f.footer("FX5U ใช้คำสั่งกำหนดตำแหน่ง เช่น DRVI/DRVA ส่งพัลส์ออกทางเอาต์พุตทรานซิสเตอร์ (Y0–Y3)")
f.save("u08_stepper")

f = Fig(1200, 560, "ความเร็วรอบมอเตอร์เหนี่ยวนำเมื่อปรับความถี่ด้วย Inverter (4 ขั้ว)", "หน่วยที่ 8")
ox, oy, gw, gh = 160, 460, 760, 330
f.line(ox, oy, ox + gw + 20, oy, INK, 3, arrow=True); f.line(ox, oy, ox, oy - gh - 20, INK, 3, arrow=True)
f.line(ox, oy, ox + gw, oy - gh, BLUE, 4)
for fr in (10, 20, 30, 40, 50):
    x = ox + gw * fr / 50; y = oy - gh * fr / 50
    f.circle(x, y, 6, BLUE, BLUE); f.text(x, oy + 28, f"{fr} Hz", 15)
    f.text(x - 10, y - 14, f"{int(120 * fr / 4)}", 15, BLUE, 600, "end")
f.text(ox + gw / 2, oy + 62, "ความถี่ที่ Inverter จ่าย", 17, INK, 600)
f.text(ox - 10, oy - gh - 30, "รอบซิงโครนัส (rpm)", 17, INK, 600, "start")
f.box(950, 150, 220, 220, "Ns = 120 f / P", ["P = จำนวนขั้ว", "", "50 Hz → 1,500 rpm", "30 Hz → 900 rpm", "สลิป 4% → 864 rpm"], LBLUE, BLUE, tsize=21, bsize=16)
f.save("u08_motor_speed")

# ===================== หน่วยที่ 9 =====================
f = Fig(1200, 600, "ลำดับการทำงานระบบสายพานบรรจุสินค้า 12 ชิ้น/กล่อง", "หน่วยที่ 9")
nodes = [("กด Start (X0)", 60, LGREEN, GREEN), ("สายพานเดิน (Y0)", 300, LBLUE, BLUE), ("เซนเซอร์ตรวจพบ (X2)", 540, LCYAN, CYAN),
         ("นับ C0 +1", 780, LBLUE, BLUE)]
for t, x, lc, c in nodes:
    f.box(x, 130, 200, 90, t, [], lc, c, tsize=17)
for a in (260, 500, 740):
    f.line(a, 175, a + 38, 175, INK, 3, arrow=True)
f.rect(1010, 120, 160, 110, LYEL, ORANGE, r=12); f.text(1090, 170, "C0 = 12 ?", 20, ORANGE, 700); f.text(1090, 200, "(K12)", 15, ORANGE)
f.line(980, 175, 1008, 175, INK, 3, arrow=True)
f.poly([(1090, 230), (1090, 300), (880, 300)], INK, 3, arrow=True); f.text(1110, 275, "ใช่", 16, GREEN, 700, "start")
f.poly([(1090, 120), (1090, 95), (880, 95), (880, 128)], INK, 3, arrow=True); f.text(1000, 88, "ไม่ใช่ → นับต่อ", 15, GRAY)
f.box(640, 260, 240, 90, "หยุดสายพาน", ["เปิดไฟ Tower สีเหลือง"], LORANGE, ORANGE, tsize=18, bsize=15)
f.poly([(640, 305), (520, 305), (520, 400)], INK, 3, arrow=True)
f.box(400, 400, 240, 90, "เปลี่ยนกล่อง", ["กดยืนยัน (X3) บน HMI"], LBLUE, BLUE, tsize=18, bsize=15)
f.poly([(400, 445), (160, 445), (160, 222)], INK, 3, arrow=True)
f.text(270, 437, "RST C0 แล้วเริ่มใหม่", 15, GRAY)
f.footer("HMI แสดงค่า C0 (จำนวนชิ้น) และจำนวนกล่องที่บรรจุแล้ว (D10) แบบเรียลไทม์")
f.save("u09_conveyor")

# ===================== หน่วยที่ 10 =====================
f = Fig(1200, 640, "ผังการค้นหาสาเหตุเมื่อเครื่องจักรควบคุมด้วย PLC ไม่ทำงาน", "หน่วยที่ 10")
qs = [("ไฟ POWER ติด?", "ตรวจแหล่งจ่าย / ฟิวส์ / สายไฟเข้า"), ("ไฟ ERR ดับ?", "อ่านรหัสข้อผิดพลาด (Module Diagnostics)"),
      ("ไฟ RUN ติด?", "ตรวจสวิตช์ RUN/STOP และโปรแกรม"), ("ไฟอินพุต X ติดเมื่อสั่งงาน?", "ตรวจสวิตช์ / เซนเซอร์ / สายอินพุต"),
      ("ไฟเอาต์พุต Y ติด?", "Monitor Ladder หาเงื่อนไขที่ไม่ครบ")]
for i, (q, fix) in enumerate(qs):
    y = 100 + i * 100
    f.rect(140, y, 380, 66, LYEL, ORANGE, r=33); f.text(330, y + 41, q, 19, INK, 600)
    f.line(520, y + 33, 680, y + 33, RED, 3, arrow=True); f.text(600, y + 24, "ไม่", 15, RED, 700)
    f.rect(684, y + 4, 470, 58, LRED, RED, r=10); f.text(919, y + 41, fix, 17, INK)
    if i < 4:
        f.line(330, y + 66, 330, y + 98, GREEN, 3, arrow=True); f.text(350, y + 88, "ใช่", 14, GREEN, 700, "start")
f.rect(140, 600 - 10, 380, 0.1, "#fff", "#fff")
f.text(330, 615, "ใช่ → ตรวจโหลด: คอนแทกเตอร์ / โซลินอยด์ / สายเอาต์พุต", 16, GREEN, 600)
f.save("u10_troubleshoot")

f = Fig(1200, 520, "ความพร้อมใช้งานของระบบ (Availability) จาก MTBF และ MTTR", "หน่วยที่ 10")
f.rect(80, 150, 760, 70, LGREEN, GREEN, r=8); f.text(460, 195, "ทำงานได้ปกติ  MTBF = 2,000 ชั่วโมง", 20, GREEN, 700)
f.rect(840, 150, 120, 70, LRED, RED, r=8); f.text(900, 195, "MTTR 4 h", 17, RED, 700)
f.text(1000, 195, "→ วนซ้ำ", 17, GRAY, 600, "start")
f.box(230, 280, 740, 150, "Availability = MTBF ÷ (MTBF + MTTR)", ["= 2,000 ÷ (2,000 + 4) = 0.998  →  99.80 %",
                                                                   "ลด MTTR ด้วยอะไหล่สำรอง + สำรองโปรแกรม (Backup) + ผังค้นหาสาเหตุ"], LBLUE, BLUE, tsize=22, bsize=18)
f.save("u10_availability")
print("svg done", len(os.listdir(OUT)))
