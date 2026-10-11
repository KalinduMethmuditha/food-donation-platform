from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Preformatted, Table, TableStyle, PageBreak
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'output/pdf/project-setup-guide.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)
GREEN = colors.HexColor('#087F5B')
INK = colors.HexColor('#172D37')
MUTED = colors.HexColor('#52666E')
LINE = colors.HexColor('#DCE8E2')
styles = {
    'title': ParagraphStyle('title', fontName='Helvetica-Bold', fontSize=23, leading=28, textColor=INK, spaceAfter=8),
    'heading': ParagraphStyle('heading', fontName='Helvetica-Bold', fontSize=13, leading=18, textColor=GREEN, spaceBefore=10, spaceAfter=7),
    'body': ParagraphStyle('body', fontName='Helvetica', fontSize=10, leading=14, textColor=INK, spaceAfter=7),
    'small': ParagraphStyle('small', fontName='Helvetica', fontSize=9, leading=12, textColor=MUTED, spaceAfter=7),
    'code': ParagraphStyle('code', fontName='Courier', fontSize=8.2, leading=11.5, textColor=INK, backColor=colors.HexColor('#F1F6F4'), borderPadding=8, spaceBefore=4, spaceAfter=13),
}
story = []
def p(text, style='body'): story.append(Paragraph(text, styles[style]))
def code(text): story.append(Preformatted(escape(text), styles['code']))
def h(text): p(text, 'heading')
def table(rows, widths):
    data = [[Paragraph(escape(cell), styles['body']) for cell in row] for row in rows]
    t = Table(data, colWidths=widths)
    t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('BACKGROUND',(0,0),(-1,0),colors.HexColor('#EFF8F4')),('LINEBELOW',(0,0),(-1,-1),.5,LINE),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),4)]))
    story.append(t)
    story.append(Spacer(1,8))

p('Food Donation Platform', 'title')
p('Member Setup Guide - Windows PowerShell', 'heading')
p('Connect a local MySQL database and run the Laravel API and Expo frontend. Prepared 10 October 2026.', 'small')
p('<b>What runs:</b> MySQL stores the data; Laravel runs on port 8000; Expo serves the frontend. Each member has their own local database unless the team deliberately configures a shared server.')
h('1. Install the required software')
table([['Software','Requirement'],['Git','Download and update the repository'],['PHP','8.3 or newer; must satisfy composer install'],['Composer','Install backend dependencies'],['Node.js and npm','Node 22.13 or newer for Expo SDK 57'],['MySQL','Local database server'],['Expo Go','Only needed for phone testing']], [140,371])
p('If using XAMPP for MySQL, check its PHP version separately. This project requires PHP 8.3 or newer.')
code('git --version\nphp -v\ncomposer --version\nnode -v\nnpm -v')
h('2. Download the project')
code('git clone https://github.com/KalinduMethmuditha/food-donation-platform.git\ncd food-donation-platform\ngit switch feature/Testing\ngit pull origin feature/Testing')
p('<b>Project owner:</b> push the latest changes before members clone or pull. For an existing checkout, run git status, save any local work, then git fetch origin, git switch feature/Testing, and git pull origin feature/Testing.')
h('3. Start MySQL and create the database')
p('Start MySQL (or the MySQL service in XAMPP). In phpMyAdmin or a MySQL client, run:')
code('CREATE DATABASE food_donation_platform\nCHARACTER SET utf8mb4\nCOLLATE utf8mb4_unicode_ci;')
p('Laravel migrations will create the tables; do not create them manually.')

story.append(PageBreak())
p('Connect and Start the Backend', 'title')
h('4. Install backend dependencies')
p('From the project root:')
code('cd backend\ncomposer install')
p('Use composer install to follow composer.lock. If Composer reports a missing PHP extension, enable it in the PHP configuration it identifies. The MySQL connection requires pdo_mysql.')
code('php --ini\nphp -m')
h('5. Configure backend/.env')
p('For a fresh checkout, copy the example file. If .env already exists, edit it instead of replacing it.')
code('Copy-Item .env.example .env')
p('Edit backend/.env and set these values:')
code('APP_NAME="Food Donation Platform"\nAPP_ENV=local\nAPP_DEBUG=true\nAPP_URL=http://127.0.0.1:8000\n\nDB_CONNECTION=mysql\nDB_HOST=127.0.0.1\nDB_PORT=3306\nDB_DATABASE=food_donation_platform\nDB_USERNAME=root\nDB_PASSWORD=')
p('Use your own MySQL username and password. Leave the password empty only if your local MySQL account has no password. The example environment defaults to SQLite, so change DB_CONNECTION to mysql.')
h('6. Generate the application key and tables')
code('php artisan key:generate\nphp artisan config:clear\nphp artisan migrate\nphp artisan migrate:status')
p('Expected result: migrations show <b>Ran</b>. Run key:generate once when creating the local environment; migrations create users, donations, tokens, status logs, and other project tables.')
h('7. Start Laravel - Terminal 1')
code('php artisan serve --host=0.0.0.0 --port=8000')
p('Keep this terminal open. On the computer, visit <b>http://127.0.0.1:8000/up</b>; it should respond successfully. The API base URL is <b>http://127.0.0.1:8000/api</b>.')

story.append(PageBreak())
p('Run Web and Test All Roles', 'title')
h('8. Install the frontend - Terminal 2')
p('Open a new terminal in the project root:')
code('cd mobile\nnpm ci')
p('Create or edit mobile/.env:')
code('EXPO_PUBLIC_API_URL=http://127.0.0.1:8000/api')
p('<b>Keep /api at the end.</b> The backend .env holds database credentials; the mobile .env only needs the API URL.')
h('9. Start the web application')
code('npx expo start --web')
p('Open the browser URL printed by Expo. Keep MySQL, the Laravel terminal, and the Expo terminal running. If the API URL changes, stop Expo with Ctrl+C and restart:')
code('npx expo start --web --clear')
h('10. Register accounts and test the full workflow')
p('Use Create Account in the app to register four separate accounts:')
table([['Role','Example email'],['Restaurant owner','restaurant@example.com'],['Household donor','household@example.com'],['NGO','ngo@example.com'],['Volunteer','volunteer@example.com']], [190,321])
for text in [
    '<b>1.</b> Volunteer: log in and enable Available for pickups.',
    '<b>2.</b> Restaurant or household: publish food with a future collection deadline.',
    '<b>3.</b> NGO: log in, find the published donation, and accept it.',
    '<b>4.</b> NGO: choose the available volunteer and assign the donation.',
    '<b>5.</b> Volunteer: open the assignment and update Pickup Started, Arrived, Collected, then Delivered.',
    '<b>6.</b> Donor and NGO: reopen or refresh screens to see the saved status. Role notifications appear when eligible unread events are fetched.',
]: p(text)
p('<b>Seeder limitation:</b> the default seeder creates one test user, not all four roles or sample donations. Register accounts and publish donations through the app. Cloning the repository does not copy another member\'s database records.')
h('Normal startup after first-time setup')
p('Start MySQL, run the Laravel serve command in backend, and run the Expo command in mobile. Dependency installation and key generation do not need to be repeated each time. After pulling schema changes, run php artisan migrate.')

story.append(PageBreak())
p('Phone Setup and Troubleshooting', 'title')
h('11. Run on a phone with Expo Go')
p('Find the computer\'s Wi-Fi IPv4 address:')
code('ipconfig')
p('If the address is 192.168.1.50, set mobile/.env as below. Replace this example with your actual address:')
code('EXPO_PUBLIC_API_URL=http://192.168.1.50:8000/api')
p('Connect phone and computer to the same Wi-Fi. Keep Laravel running with --host=0.0.0.0. Allow PHP and Node through Windows Firewall on the private network.')
p('In the phone browser, first check <b>http://192.168.1.50:8000/up</b>. Then, inside mobile, run:')
code('npx expo start --clear')
p('Scan the QR code with Expo Go. On a phone, 127.0.0.1 refers to the phone itself, so use the computer\'s Wi-Fi IP address for the backend.')
h('Common problems')
table([['Problem','What to check'],
['Could not connect to server','Laravel is running; API URL is correct and ends in /api.'],
['Access denied for user','Check DB_USERNAME and DB_PASSWORD in backend/.env.'],
['Unknown database','Create the database; check DB_DATABASE matches its name.'],
['Could not find driver','Enable PHP pdo_mysql; use php --ini to locate the active configuration.'],
['Connection refused','Start MySQL and check DB_HOST and DB_PORT.'],
['Table not found','Run php artisan migrate in backend.'],
['No encryption key','Run php artisan key:generate for the new local environment.'],
['NGO feed empty','Publish a donation with a future deadline.'],
['No volunteers shown','Register a volunteer and enable availability.'],
['Phone cannot connect','Check Wi-Fi, computer IPv4 address, and firewall access.'],
['Environment change ignored','Run php artisan config:clear; restart Expo with --clear.']], [160,351])
h('Official references')
p('<link href="https://laravel.com/framework/docs/13.x/installation" color="#087F5B">Laravel 13 installation and environment setup</link><br/><link href="https://docs.expo.dev/get-started/start-developing/" color="#087F5B">Expo: start developing on web and devices</link>', 'small')

def decorate(canvas, doc):
    w, h = A4
    canvas.saveState()
    canvas.setFillColor(GREEN)
    canvas.rect(0,h-9,w,9,fill=1,stroke=0)
    canvas.setStrokeColor(LINE)
    canvas.line(42,38,w-42,38)
    canvas.setFillColor(MUTED)
    canvas.setFont('Helvetica',9)
    canvas.drawString(42,24,'Serve With Purpose | Member setup guide')
    canvas.drawRightString(w-42,24,f'{doc.page} / 4')
    canvas.restoreState()

SimpleDocTemplate(str(OUT),pagesize=A4,leftMargin=42,rightMargin=42,topMargin=34,bottomMargin=52,title='Food Donation Platform - Member Setup Guide',author='Food Donation Platform').build(story,onFirstPage=decorate,onLaterPages=decorate)
reader = PdfReader(OUT)
assert len(reader.pages) == 4, f'Expected four pages, got {len(reader.pages)}'
text = '\n'.join(page.extract_text() for page in reader.pages)
for phrase in ['feature/Testing','composer install','DB_CONNECTION=mysql','php artisan migrate','npm ci','EXPO_PUBLIC_API_URL','Expo Go','Troubleshooting']:
    assert phrase in text, phrase
print(f'Created and verified: {OUT} ({len(reader.pages)} pages)')
