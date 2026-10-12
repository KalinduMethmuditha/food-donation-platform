from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'output/pdf'
OUT.mkdir(parents=True, exist_ok=True)
GREEN = colors.HexColor('#087F5B')
INK = colors.HexColor('#172D37')
MUTED = colors.HexColor('#52666E')
LINE = colors.HexColor('#DCE8E2')
styles = {
    'title': ParagraphStyle('title', fontName='Helvetica-Bold', fontSize=25, leading=30, textColor=INK, spaceAfter=8),
    'subtitle': ParagraphStyle('subtitle', fontName='Helvetica', fontSize=10, leading=15, textColor=MUTED, spaceAfter=14),
    'heading': ParagraphStyle('heading', fontName='Helvetica-Bold', fontSize=16, leading=21, textColor=GREEN, spaceAfter=10),
    'body': ParagraphStyle('body', fontName='Helvetica', fontSize=10.5, leading=15, textColor=INK),
    'label': ParagraphStyle('label', fontName='Helvetica-Bold', fontSize=10.5, leading=15, textColor=GREEN),
    'note': ParagraphStyle('note', fontName='Helvetica', fontSize=10, leading=15, textColor=MUTED, spaceAfter=8),
}

def p(text, style='body'):
    return Paragraph(text, styles[style])

def section(title, descriptions):
    rows = [[p(label, 'label'), p(desc)] for label, desc in zip(['Create', 'Read', 'Update', 'Delete'], descriptions)]
    table = Table(rows, colWidths=[67, A4[0] - 151])
    table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#EFF8F4')),
        ('LINEBELOW', (0, 0), (-1, -1), 0.5, LINE),
        ('LEFTPADDING', (0, 0), (-1, -1), 11),
        ('RIGHTPADDING', (0, 0), (-1, -1), 11),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ]))
    return [p(title, 'heading'), table, Spacer(1, 18)]

roles = [
    ('restaurant-owner', 'Restaurant Owner', 'Publish surplus restaurant food and track its collection and delivery.', [
        'Create and publish food donations with food details, quantity, pickup location, and collection deadline.',
        'View own donations, donation details, activity/history, collection status, dashboard statistics, and delivery notifications.',
        'The backend allows editing own Published donations. Restaurant donation Edit controls are not connected in the current screens.',
        'The backend allows deleting own Published donations. Restaurant donation Delete controls are not connected in the current screens.',
    ], 'Donations can be edited or deleted only while Published. After acceptance, the NGO coordinates pickup and the assigned volunteer updates collection status.'),
    ('household-donor', 'Household Donor', 'Share household food and manage donations through pickup and delivery.', [
        'Create and publish household food donations with food details, quantity, pickup location, and collection deadline.',
        'View own donations, donation details, History, collection progress, dashboard statistics, and delivery notifications.',
        'Edit own Published donations through the connected donation screens. Track subsequent status changes made by the assigned volunteer.',
        'Delete own Published donations after confirmation through the connected donation details screen.',
    ], 'Only the owner can edit or delete a donation, and only while Published. Accepted donations continue through the NGO and volunteer workflow.'),
    ('ngo', 'NGO', 'Review donor donations, accept them, and coordinate available volunteers.', [
        'Create a saved rejection record when rejecting a donation. Acceptance and assignment also save workflow/status records.',
        'View Published donations from household and restaurant donors, donor details, available volunteers, accepted donations, collection progress, and notifications.',
        'Accept an available donation and assign an available volunteer. Track pickup, collected, and delivered status updates made by that volunteer.',
        'No donation deletion is provided to NGOs. Rejecting a donation saves a rejection for that NGO; it does not delete the donor\'s donation.',
    ], 'A rejection does not prevent other NGOs from accepting the donation. NGOs track delivery progress; the assigned volunteer updates collection statuses.'),
    ('volunteer', 'Volunteer', 'Carry out assigned pickups and keep every participant informed of delivery progress.', [
        'Add pickup notes or progress updates to assigned donations. Status transitions save collection activity records.',
        'View assigned donations, pickup details and locations, donor and NGO information, collection history, statistics, and assignment notifications.',
        'Update assigned collection status in order: Assigned -&gt; Pickup Started -&gt; Arrived -&gt; Collected -&gt; Delivered. Also update volunteer availability.',
        'No donation or assignment deletion is provided to volunteers. Assigned work is completed through status updates.',
    ], 'Only the assigned volunteer can update collection progress. Delivered status is reflected in donor and NGO views and creates a completion notification for the donor.'),
]

def footer(canvas, doc):
    canvas.saveState()
    w, h = A4
    canvas.setFillColor(GREEN)
    canvas.rect(0, h - 9, w, 9, fill=1, stroke=0)
    canvas.setStrokeColor(LINE)
    canvas.line(42, 38, w - 42, 38)
    canvas.setFont('Helvetica', 9)
    canvas.setFillColor(MUTED)
    canvas.drawString(42, 24, 'Serve With Purpose | Food Donation Platform')
    canvas.drawRightString(w - 42, 24, '9 October 2026')
    canvas.restoreState()

for slug, role, purpose, workflow, restriction in roles:
    account = [
        f'Register a {role.lower()} account with login credentials and contact information. Upload a profile photo and submit a support request.',
        'View personal information, profile photo, role statistics, and account preferences on the Profile page.',
        'Edit name, email, phone, and location. Replace the profile photo and change notification preferences.' + (' Change pickup preferences through the volunteer preference screens.' if slug == 'volunteer' else ''),
        'Remove the profile photo or delete the account with current-password confirmation. Account deletion is blocked while donations or pickups are active.',
    ]
    story = [p(role, 'title'), p('Member CRUD Responsibilities | Current implementation', 'subtitle'), p(purpose, 'subtitle')]
    story += section('Part 1 - Donation Workflow', workflow)
    story.append(p('<b>Workflow rule:</b> ' + restriction, 'note'))
    story.append(Spacer(1, 9))
    story += section('Part 2 - Account Management', account)
    story.append(p('<b>Account deletion:</b> Personal information is anonymized and access tokens are removed. Completed donation history is retained with the participant shown as Deleted account.', 'note'))
    story.append(p('<b>CRUD:</b> Create = add a record; Read = view records; Update = edit records; Delete = remove or deactivate records. Actions described as unavailable are not implemented for that role.', 'note'))
    output = OUT / f'{slug}-crud-responsibilities.pdf'
    doc = SimpleDocTemplate(str(output), pagesize=A4, leftMargin=42, rightMargin=42, topMargin=35, bottomMargin=52,
                            title=f'{role} - CRUD Responsibilities', author='Food Donation Platform')
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    reader = PdfReader(output)
    assert len(reader.pages) == 1, (role, len(reader.pages))
    text = reader.pages[0].extract_text()
    for expected in ['Part 1', 'Part 2', 'Create', 'Read', 'Update', 'Delete', role]:
        assert expected in text, (role, expected)
    print(f'Created: {output} (1 page, two parts)')
