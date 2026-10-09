from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / 'output' / 'pdf' / 'member-crud-responsibilities.pdf'
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
GREEN = colors.HexColor('#087F5B')
NAVY = colors.HexColor('#172D37')
MUTED = colors.HexColor('#52666E')
PALE = colors.HexColor('#EFF8F4')
LINE = colors.HexColor('#DCE8E2')
styles = {
    'title': ParagraphStyle('title', fontName='Helvetica-Bold', fontSize=24, leading=29, textColor=NAVY, spaceAfter=9),
    'intro': ParagraphStyle('intro', fontName='Helvetica', fontSize=10.5, leading=15, textColor=MUTED, spaceAfter=14),
    'heading': ParagraphStyle('heading', fontName='Helvetica-Bold', fontSize=15, leading=20, textColor=GREEN, spaceAfter=9),
    'body': ParagraphStyle('body', fontName='Helvetica', fontSize=10.3, leading=15, textColor=NAVY),
    'label': ParagraphStyle('label', fontName='Helvetica-Bold', fontSize=10.3, leading=15, textColor=GREEN),
    'note': ParagraphStyle('note', fontName='Helvetica', fontSize=10, leading=15, textColor=MUTED, spaceAfter=8),
}
def p(text, style='body'):
    return Paragraph(text, styles[style])

def section(title, rows):
    table = Table([[p(label, 'label'), p(description)] for label, description in rows], colWidths=[66, A4[0] - 150])
    table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BACKGROUND', (0, 0), (0, -1), PALE),
        ('LINEBELOW', (0, 0), (-1, -1), .5, LINE),
        ('LEFTPADDING', (0, 0), (-1, -1), 11),
        ('RIGHTPADDING', (0, 0), (-1, -1), 11),
        ('TOPPADDING', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 9),
    ]))
    return [KeepTogether([p(title, 'heading'), table]), Spacer(1, 19)]

story = [p('Member CRUD Responsibilities', 'title'), p('Food Donation Platform | Implementation summary | 9 October 2026', 'intro'),
         p('<b>CRUD:</b> Create, Read, Update, Delete. This report describes the currently implemented responsibilities of the four roles.', 'intro')]
story += section('1. Restaurant Owner', [
    ('Create', 'Publish surplus food donations with quantity, pickup location, and collection deadline.'),
    ('Read', 'View own donations, collection progress, history, statistics, and notifications.'),
    ('Update', 'Edit personal information and preferences. Donation editing is supported by the backend; frontend controls are pending.'),
    ('Delete', 'Remove a profile photo or delete the account. Donation deletion is supported by the backend; frontend controls are pending.'),
])
story += section('2. Household Donor', [
    ('Create', 'Publish household food donations with food details, quantity, pickup location, and deadline.'),
    ('Read', 'View own donations, donation details, history, collection progress, and statistics.'),
    ('Update', 'Edit published donations, personal profile details, and preferences.'),
    ('Delete', 'Delete own published donations, remove a profile photo, or delete the account.'),
])
story += section('Shared Account CRUD - All Members', [
    ('Create', 'Register an account, upload a profile photo, and submit support requests.'),
    ('Read', 'View personal information, statistics, preferences, and notifications.'),
    ('Update', 'Edit name, email, phone, location, profile photo, and notification preferences.'),
    ('Delete', 'Remove a profile photo or delete the account after password confirmation.'),
])
story += [PageBreak(), p('Coordination & Collection Roles', 'title'), p('NGOs coordinate donations. Volunteers carry out pickups and deliveries.', 'intro')]
story += section('3. NGO', [
    ('Create', 'Save donation rejection records and submit support requests.'),
    ('Read', 'View available donations from restaurant and household donors, available volunteers, accepted donations, and collection progress.'),
    ('Update', 'Accept donations, assign available volunteers, edit profile details, and update preferences.'),
    ('Delete', 'Remove a profile photo or delete the account. NGOs cannot delete donors\' donations.'),
])
story += section('4. Volunteer', [
    ('Create', 'Add pickup notes or progress updates and submit support requests.'),
    ('Read', 'View assigned pickups, donor and NGO details, pickup locations, activity, and notifications.'),
    ('Update', 'Change availability, pickup preferences, profile information, and collection status.'),
    ('Delete', 'Remove a profile photo or delete the account. Volunteers cannot delete donations or assignments.'),
])
story += [p('Current Restrictions & Remaining Gap', 'heading')]
for number, text in enumerate([
    'Donors can edit or delete donations only while their status is <b>Published</b>.',
    '<b>Restaurant frontend gap:</b> Donation Edit/Delete buttons are not connected yet, although both backend APIs exist.',
    'NGO rejection saves a rejection for that NGO. It does not delete the donation or prevent another NGO from accepting it.',
    'Volunteers advance collection status in order: <b>Assigned -&gt; Pickup Started -&gt; Arrived -&gt; Collected -&gt; Delivered</b>. NGOs track these updates.',
    'Account deletion is blocked during active donations or pickups. Completed history remains with anonymized account details.',
], 1):
    story.append(p(f'<b>{number}.</b> {text}', 'note'))

def page_decoration(canvas, doc):
    canvas.saveState()
    w, h = A4
    canvas.setFillColor(GREEN)
    canvas.rect(0, h - 9, w, 9, fill=1, stroke=0)
    canvas.setStrokeColor(LINE)
    canvas.line(42, 38, w - 42, 38)
    canvas.setFont('Helvetica', 9)
    canvas.setFillColor(MUTED)
    canvas.drawString(42, 24, 'Serve With Purpose | Role responsibilities')
    canvas.drawRightString(w - 42, 24, f'{doc.page} / 2')
    canvas.restoreState()

doc = SimpleDocTemplate(str(OUTPUT), pagesize=A4, rightMargin=42, leftMargin=42, topMargin=35, bottomMargin=51,
                        title='Food Donation Platform - Member CRUD Responsibilities', author='Food Donation Platform')
doc.build(story, onFirstPage=page_decoration, onLaterPages=page_decoration)
reader = PdfReader(OUTPUT)
assert len(reader.pages) == 2, f'Expected two pages, got {len(reader.pages)}'
text = '\n'.join(page.extract_text() for page in reader.pages)
for required in ['Restaurant Owner', 'Household Donor', 'NGO', 'Volunteer', 'Shared Account CRUD', 'Restaurant frontend gap', 'anonymized']:
    assert required in text, required
print(f'Created and checked: {OUTPUT} ({len(reader.pages)} pages)')
