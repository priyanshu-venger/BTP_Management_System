from flask import Flask, request, jsonify, flash, redirect, url_for , render_template, session , make_response
from flask_pymongo import PyMongo, ObjectId
from werkzeug.utils import secure_filename
from gridfs import GridFS
import random
import email, smtplib, ssl, os
from bson import ObjectId
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from bson.errors import InvalidId
from flask_cors import CORS
from flask_cors import cross_origin
app = Flask(__name__)
CORS(app)
# Your MongoDB connection string
CONNECTION_STRING = "mongodb+srv://Lancer:Hh9Rr7h17GIgSPY1@cluster0.nf6kpbe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


app.config["MONGO_URI"] = CONNECTION_STRING
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'optional_default')
mongo = PyMongo(app)

db = mongo.cx['btp']
fs = GridFS(db)

# def init_db():
#     try:
#         # Simplified check to list database names
#         print(mongo.cx.list_database_names())
#         print("Connected to MongoDB.")
        
#         # Your existing logic...
        
#     except Exception as e:  # Catching a generic exception for debugging
#         print(f"An error occurred: {e}")
# init_db()



@app.route('/')
def index():
    if request.json.get('id') and request.json.get('role') == 'student':
        return redirect('/student_home')
    if request.json.get('id') and request.json.get('role') == 'faculty':
        return redirect('/faculty_home')
    if request.json.get('id') and request.json.get('role') == 'admin':
        return redirect('/admin_home')
    
    # return render_template("home.html")
    return "Hello World!"

def send_otp_signup(otp ,receiver_email):
    sender_email = "testemailskgp@gmail.com"
    subject = "OTP for Email Verification in BTP Report Management Website"

    body = "Welcome to BTP Report Management System !!!"+ "\nOTP: " + str(otp) + "\nUse this otp for verifying your Institute Email Id.\n\nRegards, \nBTP Report Management System"

    # password = input("Type your password and press enter:")
    password = "rlfm iyro bnpe zexv"

    # Create a multipart message and set headers
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = receiver_email
    message["Subject"] = subject

    # Add body to email
    message.attach(MIMEText(body, "plain"))
    text = message.as_string()

    # Log in to server using secure context and send email
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, text)

# Route for OTP verification
@app.route('/verify_otp_signup', methods=['POST'])
def verify_otp_signup():
    if not request.json or not 'otp' in request.json:
        return make_response(jsonify({'error': 'Missing  request or parameters'}), 400)

    entered_otp = request.json.get('otp')
    # Below if condition changed temporarily to make it work and test end-to-end functionality
    if 'otp' in session and 'email' in session:
    # if entered_otp:
        if entered_otp == str(session['otp']):
        # if entered_otp == '918273':

            #### **** Temporary ****
            # id = request.json.get('id')

            # # Check ID length and determine user type/role
            # role = None
            # if len(id) == 9 and id.isalnum():
            #     role = 'student'
            # elif len(id) == 5 and id.isalnum():
            #     role = 'faculty'
            #### **** Temporary ****

            # OTP verification successful
            users_collection = db.users
            new_user = {
                "id": session['id'],
                "password": session['password'],
                "full_name": session['full_name'],
                "email": session['email'],
                "department": session['department'],
                "role": session['role']

                # "id": request.json.get('id'),
                # "password": request.json.get('password'),
                # "full_name": request.json.get('full_name'),
                # "email": request.json.get('email'),
                # "department": request.json.get('department'),
                # "role": role
                
            }
            
            # Clear session
            session.pop('otp')
            session.pop('email')
            session.pop('id')
            session.pop('password')
            session.pop('full_name')
            session.pop('department')
            session.pop('role')

            users_collection.insert_one(new_user)

            return make_response(jsonify({'status': 'success'}), 200)
        else:
            return make_response(jsonify({'error': 'Incorrect OTP. Please try again.'}), 400)
    else:
        return make_response(jsonify({'error': 'Session expired. Please try again.'}), 400)

@app.route('/signup', methods=['POST'])
def signup():
    if not request.json or not 'id' in request.json or not 'password' in request.json or not 'full_name' in request.json or not 'email' in request.json or not 'department' in request.json:
        return make_response(jsonify({'error': 'Missing  request or parameters'}), 400)

    id = request.json.get('id')
    password = request.json.get('password')
    full_name = request.json.get('full_name')
    email = request.json.get('email').lower()
    department = request.json.get('department')

    users_collection = db.users
    existing_user = users_collection.find_one({"id": id})
    if existing_user:
        return make_response(jsonify({'error': 'Username already exists'}), 409)
    
    # Check ID length and determine user type/role
    role = None
    if len(id) == 9 and id.isalnum():
        role = 'student'
    elif len(id) == 5 and id.isalnum():
        role = 'faculty'
    else:
        return make_response(jsonify({'error': 'Invalid ID'}), 400)
    
    # Check if email is authorized under KGP domain
    # if not email.endswith('iitkgp.ac.in') and not email.endswith('@kgpian.iitkgp.ac.in'):
    #     flash('Your email is not authorized under IITKGP domain. Please use your institute email.', 'error')
    #     return redirect(url_for('signup'))
    

    # Check if email already exists
    # existing_email = users_collection.find_one({"email": email})
    # if existing_email:
    #     return make_response(jsonify({'error': 'Email already exists'}), 400)

    
    # Generate OTP
    otp = random.randint(100000,999999)
    print('signup(): otp: ', otp)

    # Send OTP to the user's email address
    send_otp_signup(otp, email)

    # Store the OTP in session for verification
    session['otp'] = otp
    session['email'] = email
    session['id'] = id
    session['password'] = password
    session['full_name'] = full_name
    session['department'] = department
    session['role'] = role

    return make_response(jsonify({'status': 'success'}), 200)


@app.route('/login', methods=['POST'])
def login():
    if not request.json or not 'id' in request.json or not 'password' in request.json:
        return make_response(jsonify({'error': 'Missing  request or parameters'}), 400)

    id = request.json.get('id')
    password = request.json.get('password')
    
    print('login(): id: ', id)
    print('login(): password: ', password)

    users_collection = db.users
    user = users_collection.find_one({"id": id, "password": password})
    if user:
        # Authentication successful, set session
        session['id'] = user['id']
        session['role'] = user.get('role')
        flash('Login successful', 'success')
        
        return make_response(jsonify({'id': user.get('id'), 'full_name': user.get('full_name'), 'email': user.get('email'), 'department': user.get('department'), 'role': user.get('role')}), 200)
    else:
        return make_response(jsonify({'error': 'Invalid user id or password'}), 401)

def send_otp_forgot_password(otp ,receiver_email):
    sender_email = "testemailskgp@gmail.com"
    subject = "OTP for Resetting Password in BTP Report Management Website"

    body = "Welcome to BTP Report Management System !!!" + "\nOTP: " + str(otp) + "\nUse this otp to reset your password.\n\nRegards, \nBTP Report Management System"

    # password = input("Type your password and press enter:")
    password = "rlfm iyro bnpe zexv"

    # Create a multipart message and set headers
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = receiver_email
    message["Subject"] = subject

    # Add body to email
    message.attach(MIMEText(body, "plain"))
    text = message.as_string()

    # Log in to server using secure context and send email
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, receiver_email, text)

@app.route('/forgot_password', methods=['GET', 'POST'])
def forgot_password():
    if not request.json or not 'email' in request.json:
        return make_response(jsonify({'error': 'Missing email parameter'}), 400)

    email = request.json.get('email').lower()

    # Assuming you have a users collection in your MongoDB database
    users_collection = db.users

    # Check if email exists in the database
    user = users_collection.find_one({"email": email})
    if user:
        # Generate OTP
        otp = random.randint(100000, 999999)
        # Send OTP to the user's email address (replace this with your email sending function)
        send_otp_forgot_password(otp,email)  # Assuming send_otp is a function to send OTP
        # Store the OTP and email in session for verification
        session['otp'] = otp
        session['email'] = email

        flash('An OTP has been sent to your email address.', 'success')
        # return redirect('/verify_otp_forgot_password')
        return make_response(jsonify({'message': 'An OTP has been sent to your email address.'}), 200)

    else:
        flash('Email address not found.', 'error')
        # return redirect('/forgot_password')
        return make_response(jsonify({'error': 'Email address not found.'}), 404)

    # return render_template('forgot_password.html')

# Route for OTP verification
@app.route('/verify_otp_forgot_password', methods=['GET', 'POST'])
def verify_otp_forgot_password():
    if not request.json or not 'otp' in request.json:
        return make_response(jsonify({'error': 'Missing OTP parameter'}), 400)
    entered_otp = request.form['otp']
    print(session['otp'])
    if 'otp' in session and 'email' in session:
        if entered_otp == str(session['otp']):
            # OTP verification successful
            # return redirect('/reset_password')
            return make_response(jsonify({'message': 'OTP verification successful'}), 200)
        else:
            flash('Incorrect OTP. Please try again.', 'error')
            # return redirect('/verify_otp_forgot_password')
            return make_response(jsonify({'error': 'Incorrect OTP. Please try again.'}), 400)
    else:
        flash('Session expired. Please try again.', 'error')
        # return redirect('/forgot_password')
        return make_response(jsonify({'error': 'Session expired. Please try again.'}), 400)

    # return render_template('verify_otp.html')

@app.route('/reset_password', methods=['POST'])
def reset_password():
    if not request.json or not 'password' in request.json or not 'confirm_password' in request.json:
        return make_response(jsonify({'error': 'Missing password or confirm_password parameter'}), 400)

    password = request.json['password']
    confirm_password = request.json['confirm_password']

    if password == confirm_password:
        # Assuming you have a users collection in your MongoDB database
        users_collection = db.users

        # Update the user's password in the database
        try:
            # Update the password in the database
            users_collection.update_one({"email": session['email']}, {"$set": {"password": password}})
            # Clear session
            session.pop('otp')
            session.pop('email')

            return make_response(jsonify({'message': 'Password reset successfully. You can now login with your new password.'}), 200)
        except Exception as e:
            # Handle exceptions (e.g., database errors)
            return make_response(jsonify({'error': 'Error updating password'}), 500)
    else:
        return make_response(jsonify({'error': 'Passwords do not match. Please try again.'}), 400)


@app.route('/student_home', methods=['GET'])
def student_home():
    if request.json.get('id') and request.json.get('role') == 'student':
        return make_response(jsonify({'message': 'Hey student!'}), 200)
    else:
        return make_response(jsonify({'error': 'You are not authorized to access this page.'}), 403)

@app.route('/faculty_home', methods=['GET'])
def faculty_home():
    if request.json.get('id') and request.json.get('role') == 'faculty':
        return make_response(jsonify({'message': 'Hey faculty!'}), 200)
    else:
        return make_response(jsonify({'error': 'You are not authorized to access this page.'}), 403)

@app.route('/admin_home', methods=['GET'])
def admin_home():
    if request.json.get('id') and request.json.get('role') == 'admin':
        return make_response(jsonify({'message': 'Hey admin!'}), 200)
    else:
        return make_response(jsonify({'error': 'You are not authorized to access this page.'}), 403)

    
# Route to view user profile
@app.route('/profile', methods=['GET'])
def view_profile():
    if 'id' in session:
        user_id = session['id']
        users_collection = db.users
        user = users_collection.find_one({'id': user_id})
        if user:
            # Return JSON response with profile data
            return make_response(jsonify({'profile_info': user}), 200)
        else:
            return make_response(jsonify({'error': 'User not found'}), 404)
    else:
        return make_response(jsonify({'error': 'Unauthorized access. Sign In first.'}), 401)

    

from bson import json_util
import json
@app.route('/btp_list', methods=['GET','POST'])
def btp_list():
    if request.json.get('id') and request.json.get('role') in ['faculty', 'student']:
        btp_collection = db.btp_list
        users_collection = db.users
        application_collection = db.application

        projects_cursor = btp_collection.find() # This is a cursor
        projects_list = [] # Create an empty list to hold modified project details

        for project in projects_cursor:
            # Fetch the professor's details for each project
            user = users_collection.find_one({"id": project['prof_id']})

            # Initialize project status as 'Apply' by default
            project_status = 'Apply'
            application_id = "None"
            # If the user is a student, check their application and approval status for each project
            if request.json.get('role') == 'student':
                roll_no = request.json.get('id')
                application = application_collection.find_one({"btp_id": str(project["btp_id"]), "roll_no": roll_no})
                
                if application:
                    application_id = application["_id"]
                    if application["status"] == "Approved":
                        project_status = 'Approved'
                    elif application["status"] == "Pending":
                        project_status = 'Pending'
                    elif application["status"] == "Approved by Guide":
                        project_status = 'Approved by Guide'
                    elif application["status"] == "Applied for Co-Guide":
                        project_status = 'Applied for Co-Guide'
                    else:
                        project_status=application['status']
            # Append professor details and project status to the project dictionary
            project_with_details = {
                'btp_id': project['btp_id'],
                'btp_name': project['btp_name'],
                'project_file_id': str(project['project_file_id']),
                'prof_name': user.get('full_name', ''),
                'prof_email': user.get('email', ''),
                'department': user.get('department', ''),
                'status': project_status, # Include project status
                'application_id': str(application_id)
            }

            # Add this updated project dictionary to the list
            projects_list.append(project_with_details)
        projects_list1 = json.loads(json_util.dumps(projects_list))
        # Convert the ObjectId to string in the JSON response
        # json_projects = json_util.dumps({'projects': projects_list})
        
        # Return JSON response
        return make_response(jsonify({'projects':projects_list1}), 200)
    else:
        return make_response(jsonify({'error': 'Please login to view the BTP list'}), 401)



@app.route('/upload_project', methods=['POST'])
def upload_project():
    btp_collection = db.btp_list
    
    prof_id = request.form.get('id')
    # btp_name = request.json.get('btp_name')
    btp_name = request.form.get('btp_name')
    print('upload_project(): btp_name: ', btp_name)
    
    # Check for an existing project with the same name and professor ID
    existing_project = btp_collection.find_one({"btp_name": btp_name, "prof_id": prof_id})
    if existing_project:
        return make_response(jsonify({'error': 'A project with the same name already exists. Please choose a different name.'}), 400)
    
    while True:
        random_no = random.randint(10000, 99999)
        if not btp_collection.find_one({"btp_id": random_no}):
            break  # If the generated btp_id is unique, exit the loop 
    
    btp_id = str(random_no)
    
    project_file = request.files['project_file']
    file_id = fs.put(project_file, filename=project_file.filename, content_type=project_file.content_type)

    new_project = {
        "btp_id": btp_id,
        "btp_name" : btp_name,
        "prof_id": prof_id,
        "project_file_id" : file_id
    }
    
    btp_collection.insert_one(new_project)
    return make_response(jsonify({'message': 'Project uploaded successfully'}), 200)


@app.route('/file/<file_id>', methods=['GET'])
def file(file_id):
    file = fs.get(ObjectId(file_id))
    if file:
        response = make_response(file.read())
        response.mimetype = file.content_type
        return response
    else:
        return make_response(jsonify({'error': 'File not found'}), 404)

@app.route('/apply_for_btp', methods=['POST'])
def apply_for_btp():
    if request.json.get('id') and request.json.get('role') == 'student':
        if not request.json or not 'btp_id' in request.json:
            return make_response(jsonify({'error': 'Missing btp_id parameter'}), 400)

        application_collection = db.application
        btp_id = request.json.get('btp_id')
        roll_no = request.json.get('id')

        existing_application = application_collection.find_one({"btp_id": btp_id, "roll_no": roll_no})
        if existing_application:
            return make_response(jsonify({'error': 'You have already applied for this project.'}), 400)
        
        new_application = {
            "btp_id": btp_id,
            "roll_no": roll_no,
            "status" : "Pending",
        }

        application_collection.insert_one(new_application)

        return make_response(jsonify({'message': 'Application submitted successfully'}), 200)
    else:
        return make_response(jsonify({'error': 'Please login as a student before applying'}), 401)

    
@app.route('/application_list', methods=['POST','GET'])
def application_list():
    print("hi")
    if request.json.get('id') and request.json.get('role') == 'faculty':
        users_collection = db.users
        application_collection = db.application
        prof_id = request.json.get('id')
        projects = db.btp_list.find({"prof_id": prof_id})

        applications_per_project = {}
        project_name = {}
        # print(prof_id)
        for project in projects:
            applications_cursor = application_collection.find({"btp_id": str(project["btp_id"])})
            applications_list = []
            for application in applications_cursor:
                user = users_collection.find_one({"id": str(application['roll_no'])})
                if user:
                    # Create a new dictionary for the application with all details
                    detailed_application = {
                        "id" : str(application["_id"]),
                        "status" : application['status'],
                        "roll_no": application['roll_no'],
                        "student_name": user.get('full_name', 'Unknown'),
                        "email": user.get('email', 'Unknown'),
                        "department": user.get('department', 'Unknown'),
                        "name":project["btp_name"]
                    }
                    # print(detailed_application)
                    applications_list.append(detailed_application)
            applications_per_project[str(project["btp_id"])] = applications_list
            project_name[str(project["btp_id"])] = project["btp_name"]
        print('applications_per_project', applications_per_project, 'project_name', project_name)
        return make_response(jsonify({'applications_per_project': applications_per_project, 'project_name': project_name}), 200)
    else:
        return make_response(jsonify({'error': 'Unauthorized access. Please login as faculty.'}), 401)

@app.route('/application_approval/<application_id>', methods=['POST'])
def application_approval(application_id):
    # application_id=request.json.get('aid')
    print(application_id)
    if request.json.get('id') and request.json.get('role') == 'faculty':
        action = request.json.get('action')
        
        # Validate application_id is not None or empty
        if not application_id or not action:
            return make_response(jsonify({'error': 'Missing application ID or action.'}), 400)

        try:
            # Ensure application_id is a valid ObjectId
            valid_application_id = ObjectId(application_id)
        except InvalidId:
            return make_response(jsonify({'error': 'Invalid application ID.'}), 400)

        try:
            application_collection = db.application
            btp_id = application_collection.find_one({"_id": valid_application_id}).get("btp_id")

            btp_collection = db.btp_list
            btp_project = btp_collection.find_one({"btp_id": btp_id})

            if btp_project:
                prof_id = btp_project.get('prof_id')
                professor = db.users.find_one({"id": prof_id})
                professor_department = professor.get('department')
                
                student = db.users.find_one({"id": application_collection.find_one({"_id": valid_application_id})['roll_no']})
                student_department = student.get('department')

                if professor_department == student_department:
                    # Proceed with the database update using valid_application_id
                    result = application_collection.update_one(
                        {"_id": valid_application_id},
                        {"$set": {"status": "Approved" if action == "approve" else "Pending"}}
                    )

                    if result.modified_count == 1:
                        return make_response(jsonify({'message': 'Application updated successfully.'}), 200)
                    else:
                        return make_response(jsonify({'error': 'Application could not be updated.'}), 500)
                else:
                    return redirect(url_for('select_co_guides',application_id=valid_application_id))

        except Exception as e:
            return make_response(jsonify({'error': f'An error occurred: {str(e)}'}), 500)

    else:
        return make_response(jsonify({'error': 'Unauthorized access. Please login as faculty.'}), 401)

@app.route('/approved_list', methods=['GET','POST'])
def approved_list():
    if request.json.get('id') and request.json.get('role') == 'faculty':
        users_collection = db.users
        application_collection = db.application
        prof_id = request.json.get('id')
        projects = db.btp_list.find({"prof_id": prof_id})

        approved_per_project = {}
        project_name = {}

        # print(prof_id)
        for project in projects:
            applications_cursor = application_collection.find({"btp_id": str(project["btp_id"]), "status" : "Approved"})
            applications_list = []
            for application in applications_cursor:
                user = users_collection.find_one({"id": str(application['roll_no'])})
                if user:
                    # Create a new dictionary for the application with all details
                    detailed_application = {
                        "id" : str(application["_id"]),
                        "roll_no": application['roll_no'],
                        "student_name": user.get('full_name', 'Unknown'),
                        "email": user.get('email', 'Unknown'),
                        "department": user.get('department', 'Unknown')
                    }
                    # print(detailed_application)
                    applications_list.append(detailed_application)
            approved_per_project[str(project["btp_id"])] = applications_list
            project_name[str(project["btp_id"])] = project["btp_name"]

        return make_response(jsonify({'approved_per_project': approved_per_project, 'project_name': project_name}), 200)
    else:
        return make_response(jsonify({'error': 'Unauthorized access. Please login as faculty.'}), 401)


@app.route('/change_application_status/<application_id>', methods=['POST'])
def change_application_status(application_id):
    if request.json.get('role') != 'faculty':
        return make_response(jsonify({'error': 'Unauthorized access. Please login as faculty.'}), 401)

    action = request.json.get('action')
    if action == 'reject':
        # Update the application status to 'Pending'
        db.application.update_one({'_id': ObjectId(application_id)}, {'$set': {'status': 'Pending'}})
        
        # Delete co-guides selections related to this application
        co_guides_selected = db.co_guides_selected.find_one({"application_id": ObjectId(application_id)})
        if co_guides_selected:
            db.co_guides_selected.delete_many({"application_id": ObjectId(application_id)})
            
        return make_response(jsonify({'message': 'Application status changed to Pending.'}), 200)
    else:
        return make_response(jsonify({'error': 'Invalid action.'}), 400)


@app.route('/list_and_delete_applications', methods=['GET'])
def list_and_delete_applications():
    if request.json.get('id') and request.json.get('role') == 'student':
        users_collection = db.users
        application_collection = db.application
        btp_collection = db.btp_list
        user_roll_no = request.json.get('id')
        user_applications = application_collection.find({"roll_no": user_roll_no})
        
        applications = []
        for application in user_applications:
            btp = btp_collection.find_one({"btp_id": application["btp_id"]})
            prof_id = btp["prof_id"]
            prof = users_collection.find_one({"id": prof_id})
            application["btp_name"] = btp["btp_name"]
            application["prof_name"] = prof["full_name"]
            application["department"] = prof["department"]
            application["email"] = prof["email"]
            applications.append(application)
        
        return make_response(jsonify({'applications': applications}), 200)
    else:
        return make_response(jsonify({'error': 'Please login as a student to view your applications.'}), 401)

@app.route('/delete_application/<application_id>', methods=['POST'])
def delete_application(application_id):
    if request.json.get('id') and request.json.get('role') == 'student':
        try:
            application_collection = db.application
            application_id = ObjectId(application_id)
            application_collection.delete_one({'_id': application_id})

            # Delete co-guides selections related to this application
            co_guides_selected = db.co_guides_selected.find_one({"application_id": ObjectId(application_id)})

            if co_guides_selected:
                db.co_guides_selected.delete_many({"application_id": ObjectId(application_id)})

            return make_response(jsonify({'message': 'Application deleted successfully.'}), 200)
        except:
            return make_response(jsonify({'error': 'Failed to delete the application.'}), 500)
    else:
        return make_response(jsonify({'error': 'Please login as a student to view your applications.'}), 401)


@app.route('/select_co_guides/<application_id>', methods=['GET', 'POST'])
def select_co_guides(application_id):
    if(request.method=='POST'):
        role=request.json.get('role')
    else:
        role=request.args.get('role')
    if role == 'faculty':
        if request.method == 'POST':
            co_guides_selected = request.json.get('co_guides', [])
            print(co_guides_selected)
            # Save the selected co-guides for the application
            co_guides_collection = db.co_guides_selected
            co_guides=[]
            for i in range(len(co_guides_selected)):
                co_guides.append(ObjectId((co_guides_selected[i]['_id'])))
            co_guides_collection.insert_one({
                "application_id": ObjectId(application_id),
                "co_guides_selected": co_guides
                # "status": "Pending"
            })
            print(co_guides)

            # Update the status of the application to 'Approved by Guide'
            application_collection = db.application
            application_collection.update_one(
                {"_id": ObjectId(application_id)},
                {"$set": {"status": "Approved by Guide"}}
            )

            return make_response(jsonify({'message': 'Co-guides selected successfully'}), 200)
        else:
            # Fetch student's roll_no from the application
            roll_no = db.application.find_one({"_id": ObjectId(application_id)})['roll_no']

            # Fetch student's department using the roll_no
            student_dept = db.users.find_one({"id": roll_no})['department']

            # Fetch faculties from the student's department
            co_guides = db.users.find({"role": "faculty", "department": student_dept})
            co_guides_list = [{'_id': str(co_guide['_id']), 'full_name': str(co_guide['full_name'])} for co_guide in co_guides]
            print(co_guides_list)
            return make_response(jsonify({'co_guides': co_guides_list}), 200)
    else:
        return make_response(jsonify({'error': 'Unauthorized access. Please login as faculty.'}), 401)


@app.route('/view_selected_co_guides/<application_id>', methods=['GET'])
def view_selected_co_guides(application_id):
    # if request.args.get('role') == 'student':
    co_guides_collection = db.co_guides_selected
    selected_co_guides = co_guides_collection.find_one({"application_id": ObjectId(application_id)})
    if selected_co_guides:
        co_guides = selected_co_guides.get("co_guides_selected", [])
        print(co_guides)
        co_guides_list = [{'_id': str(co_guide), 'full_name': db.users.find_one({'_id': co_guide})['full_name']} for co_guide in co_guides]
        return make_response(jsonify({'co_guides': co_guides_list}), 200)
    else:
        return make_response(jsonify({'error': 'No co-guides selected yet'}), 404)
    # else:
    #     return make_response(jsonify({'error': 'Unauthorized access. Please login as a student.'}), 401)


@app.route('/send_applications_to_co_guides/<application_id>', methods=['POST'])
def send_applications_to_co_guides(application_id):
    if request.json.get('role') == 'student':
        if request.method == 'POST':
            print(request.json.get('co_guides', []))
            # Retrieve the selected co-guides from the request JSON
            selected_co_guides = request.json.get('co_guides', [])

            # Delete existing co-guides selected for the given application ID
            db.co_guides_selected.delete_many({"application_id": ObjectId(application_id)})

            # Insert new documents for the selected co-guides
            for co_guide_id in selected_co_guides:
                print(co_guide_id['_id'])
                db.co_guides_selected.insert_one({
                    "application_id": ObjectId(application_id),
                    "co_guide_id": co_guide_id['_id'],
                    "status": "Applied"  # Set status to 'Applied'
                })

            # Update the status of the application to 'Applied for Co-Guide'
            db.application.update_one(
                {"_id": ObjectId(application_id)},
                {"$set": {"status": "Applied for Co-Guide"}}
            )

            return make_response(jsonify({'message': 'Applications sent to selected co-guides successfully.'}), 200)
        else:
            return make_response(jsonify({'error': 'Invalid request method.'}), 405)
    else:
        return make_response(jsonify({'error': 'Unauthorized access. Please login as faculty.'}), 401)

@app.route('/view_users')
def view_users():
    if request.json.get('role') == 'admin':
        users_collection = db.users
        all_users = users_collection.find()
        users_list = []
        for user in all_users:
            if user['role'] == 'admin':
                continue
            user_details = {
                '_id': str(user.get('_id', '')),
                'id': user.get('id', ''),
                'full_name': user.get('full_name', ''),
                'email': user.get('email', ''),
                'department': user.get('department', ''),
                'role': user.get('role', '')
            }
            users_list.append(user_details)
        return make_response(jsonify({'users': users_list}), 200)
    else:
        return make_response(jsonify({'error': 'Unauthorized access. Please login as admin.'}), 401)


@app.route('/delete_user/<user_id>', methods=['POST'])
def delete_user(user_id):
    if request.json.get('role') == 'admin':
        try:
            user_id = ObjectId(user_id)
        except:
            return make_response(jsonify({'error': 'Invalid user ID.'}), 400)

        try:
            users_collection = db.users

            # Find the user by ID
            user = users_collection.find_one({"_id": user_id})
            if not user:
                return make_response(jsonify({'error': 'User not found.'}), 404)

            # Delete the user
            users_collection.delete_one({"_id": user_id})

            # Delete related documents from other collections
            # Example: If the user has projects, delete them from the projects collection
            btp_collection = db.btp_list
            btp_collection.delete_many({"prof_id": user_id})

            # Example: If there are applications associated with the user, delete them
            application_collection = db.application
            application_collection.delete_many({"roll_no": user['id']})

            # Example: If there are co-guides associated with the user, delete them
            co_guides_collection = db.co_guides_selected
            co_guides_collection.delete_many({"co_guides_selected": user_id})
            co_guides_collection.delete_many({"co_guides_selected": {"$in": [user_id]}})

            return make_response(jsonify({'message': 'User and related information deleted successfully.'}), 200)
        except Exception as e:
            return make_response(jsonify({'error': f'An error occurred while deleting the user: {str(e)}'}), 500)
    else:
        return make_response(jsonify({'error': 'Unauthorized access. Please login as admin.'}), 401)

@app.route('/confirm_project', methods=['POST'])
def confirm_project():
    if request.json.get('role') == 'student':
        selected_project_id = request.json.get('project_id')
        roll_no = request.json.get('id')

        if not selected_project_id:
            return make_response(jsonify({'error': 'Please select a project to confirm.'}), 400)

        try:
            application_collection = db.application

            # Update the status of all projects associated with the student to "Pending" except the selected one
            application_collection.update_many({"roll_no": roll_no, "status": "Temporarily Confirmed", "btp_id": {"$ne": selected_project_id}},
                                                {"$set": {"status": "Approved"}})

            # Update the status of the selected project to "Confirmed"
            application_collection.update_one({"roll_no": roll_no, "status": "Approved", "btp_id": selected_project_id},
                                              {"$set": {"status": "Temporarily Confirmed"}})

            return make_response(jsonify({'message': 'Project confirmed successfully.'}), 200)
        except Exception as e:
            return make_response(jsonify({'error': f'An error occurred: {str(e)}'}), 500)
    else:
        return make_response(jsonify({'error': 'Unauthorized access. Please login as a student.'}), 401)

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from flask_mail import Mail, Message

# Email configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'testemailskgp@gmail.com'
app.config['MAIL_PASSWORD'] = 'rlfm iyro bnpe zexv'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)

department_emails = {
    "CSE": "paramanandabhaskar@gmail.com",
    "ECE": "paramanandabhaskar@gmail.com",
    "ME": "me_dept@example.com",
    "CE": "ce_dept@example.com",
    "AE": "ae_dept@example.com",
    "MBA": "mba_dept@example.com"
}

@app.route('/send_email', methods=['POST'])
def send_email():
    if request.json.get('id') and request.json.get('role') == 'student':
        users_collection = db.users
        application_collection = db.application
        btp_collection = db.btp_list
        user_roll_no = request.json.get('id')
        applications = application_collection.find({"roll_no": user_roll_no, "status": "Temporarily Confirmed"})
        
        for application in applications:

            btp_id = application.get("btp_id")
            btp = btp_collection.find_one({"btp_id": btp_id})
            prof = users_collection.find_one({"id": btp["prof_id"]})
            stud = users_collection.find_one({"id": user_roll_no})

            data = {
                "btp_id": btp_id,
                "btp_name": btp["btp_name"],
                "name": stud["full_name"],
                "dep": stud["department"],
                "prof_name": prof["full_name"],
                "faculty_name": prof["full_name"]
            }

            # Get co-guide name
            co_guide = db.co_guides_selected.find_one({"application_id": application["_id"]})
            if co_guide:
                co_guide_id = co_guide.get('co_guide_id')
                co_guide_user = users_collection.find_one({"_id": ObjectId(co_guide_id)})
                data['coguide_name'] = co_guide_user.get('full_name', 'No name provided') if co_guide_user else 'User not found'
            else:
                data['coguide_name'] = 'No co-guide assigned'

            # Generate PDF
            pdf_filename = f"{btp_id}.pdf"
            c = canvas.Canvas(pdf_filename, pagesize=letter)
            c.drawString(100, 780, f"BTP Id: {btp_id}")
            c.drawString(100, 760, f"BTP NAME: {data['btp_name']}")
            c.drawString(100, 740, f"Name: {data['name']}")
            c.drawString(100, 720, f"Department: {data['dep']}")
            c.drawString(100, 700, f"Co-Guide Name: {data['coguide_name']}")
            c.drawString(100, 680, f"Faculty Name: {data['faculty_name']}")
            c.save()

            # Send email
            recipient_email = department_emails.get(data["dep"], "default_email@example.com")
            msg = Message("BTP Application",
                          sender= "testemailskgp@gmail.com",
                          recipients=[recipient_email])
            msg.body = "Please find the attached PDF for the BTP application."
            with open(pdf_filename, "rb") as fp:
                msg.attach(pdf_filename, "application/pdf", fp.read())
            
            mail.send(msg)
            application_collection.update_one(
                {"_id": application["_id"]},
                {"$set": {"status": "Confirmed"}}
            )
        return make_response(jsonify({'message': 'Applications sent successfully.'}), 200)
    else:
        return make_response(jsonify({'error': 'Please login as a student to send applications to HOD.'}), 401)
@app.route('/applied_projects', methods=['POST'])
def applied_projects():
    if request.json.get('id') and request.json.get('role') == 'student':
        roll_no = request.json.get('id')
        application_collection = db.application
        btp_collection = db.btp_list
        users_collection = db.users

        # Fetch all applications where the status is not 'Apply'
        applied_applications = application_collection.find({"status": {"$ne": "Apply"}})

        # Initialize an empty list to hold the projects
        projects_list = []

        # Iterate through each applied application to get the corresponding project details
        for application in applied_applications:
            # Fetch the project details from the btp_list collection
            project = btp_collection.find_one({"btp_id": application["btp_id"]})

            if project:
                # Fetch the professor's details for the project
                user = users_collection.find_one({"id": project['prof_id']})

                # Determine the project status based on the application status
                project_status = application["status"]

                # Append project details to the list
                projects_list.append({
                    'btp_id': project['btp_id'],
                    'btp_name': project['btp_name'],
                    'project_file_id': str(project['project_file_id']),
                    'prof_name': user.get('full_name', ''),
                    'prof_email': user.get('email', ''),
                    'department': user.get('department', ''),
                    'status': project_status,
                    'application_id': str(application["_id"])
                })

        # Return JSON response with the list of applied projects
        return make_response(jsonify({'projects': projects_list}), 200)
    else:
        return make_response(jsonify({'error': 'Unauthorized access. Please login as a student.'}), 401)

@app.route('/co_guide_applications',methods=['POST'])
def co_guide_applications():
    print(request.json.get('id'))
    if request.json.get('id') and request.json.get('role') == "faculty":
        # Fetch applications for the current co-guide from the database
        id = db.users.find_one({"id": request.json.get('id')}).get("_id")
        co_guides_selected = db.co_guides_selected.find({"co_guide_id": str(id)})
        applications = [] # Initialize an empty list
        
        for c in co_guides_selected:
            application = db.application.find_one({"_id": (c['application_id'])}) # Use find_one instead of find
            if application:
                btp_proj = db.btp_list.find_one({"btp_id": application['btp_id']})
                application['btp_name'] = btp_proj['btp_name']
                faculty = db.users.find_one({"id": btp_proj['prof_id']})
                application['faculty_name'] = faculty['full_name']
                application['faculty_email'] = faculty['email']
                application['_id']=str(application['_id'])
                applications.append(application)
                
        print(applications)
        # return render_template('co_guide_applications.html', applications=applications)
        return make_response(jsonify({'message': 'Application approved successfully.','applications':applications}), 200)
    else:
        flash('Access denied.', 'error')
        # return redirect('/') # Redirect to login page or any other appropriate page
        return make_response(jsonify({'error': 'Access denied.'}), 401)

@app.route('/approve_application/<application_id>', methods=['POST'])
def approve_application(application_id):
    if request.json.get('role') == "faculty":
        co_guide_id = db.users.find_one({"id": request.json.get('id')}).get("_id")
        print(co_guide_id)
        application = db.co_guides_selected.find_one({"application_id": ObjectId(application_id), "co_guide_id": str(co_guide_id)})
        if application:
            # Update the status of the application to 'Approved'
            db.co_guides_selected.update_many(
                {"application_id": ObjectId(application_id)},
                {"$set": {"status": "Approved"}}
            )

            db.co_guides_selected.delete_many({"application_id": ObjectId(application_id),"status": {"$ne": "Approved"}})

            # Update the status of the application to 'Approved' in the application collection
            db.application.update_many(
                {"_id": ObjectId(application_id)},
                {"$set": {"status": "Approved"}}
            )
            return make_response(jsonify({'message': 'Application approved successfully.'}), 200)
        else:
            return make_response(jsonify({'error': 'Application not found or you do not have permission to approve it.'}), 404)
    else:
        return make_response(jsonify({'error': 'Access denied.'}), 401)


@app.route('/logout',methods=['POST','GET'])
@cross_origin()
def logout():
    # Clear the session when user logs out
    session.pop('id', None)
    session.pop('role', None)
    return make_response(jsonify({'message': 'You have been logged out.'}), 200)

if __name__ == "__main__":
    app.run(debug=True)