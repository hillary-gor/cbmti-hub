import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, BookOpen, GraduationCap, Shield } from "lucide-react"

export function HandbookContent() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Student Handbook</h1>
        <p className="text-lg text-muted-foreground">
          Code Blue Medical Training Institute - Official Student Handbook 2024-2029
        </p>
      </div>

      <Separator />

      {/* Welcome Section */}
      <section id="welcome" className="scroll-mt-20 space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">Welcome Message</h2>
        <div className="space-y-4 text-base leading-7">
          <p>Dear Student,</p>
          <p>
            Welcome to Code Blue Medical Training Institute. We aim to provide a friendly and supportive environment for
            your study, and we hope that you enjoy and you will find it a rewarding experience being at CBMTI.
          </p>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This handbook is the official notification of standards, rules, policies, values and responsibilities that
              characterize student life at CBMTI. You are expected to read, understand and comply with all provisions.
            </AlertDescription>
          </Alert>
          <p className="text-sm text-muted-foreground">
            <strong>Principal and CFO:</strong> Mr. Kelvin Karanja
          </p>
        </div>
      </section>

      {/* Vision, Mission, Core Values */}
      <section id="vision-mission" className="scroll-mt-20 space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">Vision, Mission & Goals</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>To produce high standards and competent Health Care Professionals.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                To develop the unique abilities and potential of each student by offering an enriched educational
                program. We strive for excellence through a hands-on-approach and rich traditions rooted in our
                innovative curriculum.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Core Values */}
      <section id="core-values" className="scroll-mt-20 space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">Core Values</h2>
        <div className="space-y-3">
          <div className="rounded-lg border border-border p-4">
            <h3 className="font-semibold">Passionate, Caring and Professional Competence</h3>
            <p className="text-sm text-muted-foreground">Offering quality care to clients and patients</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <h3 className="font-semibold">Respect and Fairness</h3>
            <p className="text-sm text-muted-foreground">
              We value human dignity, rights of other people and being gender sensitive
            </p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <h3 className="font-semibold">Honesty and Integrity</h3>
            <p className="text-sm text-muted-foreground">For professional credibility of the college, CBMTI</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <h3 className="font-semibold">Transparency and Accountability</h3>
            <p className="text-sm text-muted-foreground">In all interventions and use of resources</p>
          </div>
          <div className="rounded-lg border border-border p-4">
            <h3 className="font-semibold">Team Work and Collaborations</h3>
            <p className="text-sm text-muted-foreground">
              We value collaborations among other institutions, administrative units, students and staff
            </p>
          </div>
        </div>
      </section>

      {/* Organization */}
      <section id="organization" className="scroll-mt-20 space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">Organization of CBMTI</h2>

        <div id="accreditation" className="scroll-mt-20 space-y-3">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Accreditation</h3>
          <p className="leading-7">
            The institution is a midlevel tertiary training institution approved by the Technical and Vocational
            Education Training Authority of Kenya & NITA in the training of healthcare providers. Levels of training
            offered are Certificate and Diploma.
          </p>
        </div>

        <div id="departments" className="scroll-mt-20 space-y-3">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Departments</h3>
          <p className="leading-7">
            Each course/program is placed under a department. Departments are concerned with the academic operations and
            success of the students. The person of contact in a department is the Head of Department (HOD).
          </p>
        </div>

        <div id="facilities" className="scroll-mt-20 space-y-3">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Facilities</h3>
          <ul className="ml-6 list-disc space-y-2 leading-7">
            <li>
              <strong>Classrooms/Lecture Halls:</strong> Well lit and equipped with comfortable seats, desks and white
              boards
            </li>
            <li>
              <strong>Learning Materials:</strong> Students shall be provided access to recommended learning materials
              upon registration
            </li>
            <li>
              <strong>Resource Centers:</strong> Library and simulation skills laboratory with updated materials,
              journals and training equipment
            </li>
          </ul>
        </div>

        <div id="communication" className="scroll-mt-20 space-y-3">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Communication</h3>
          <p className="leading-7">
            Effective communication is vital to ensure successful completion of the program. Students are expected to
            communicate appropriately, adequately, truthfully, verbally and in writing.
          </p>
          <Card>
            <CardHeader>
              <CardTitle>Official College Contacts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">
                <strong>Email:</strong> Info@codebluemedical.co.ke
              </p>
              <p className="text-sm">
                <strong>Phone:</strong> +254722436961
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Code of Conduct */}
      <section id="code-of-conduct" className="scroll-mt-20 space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">Code of Conduct</h2>
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            The aim of education is the intellectual, personal, social, and ethical development of the individual. This
            Student Code of Conduct sets forth the standards of behavior expected of students who choose to join the
            CBMTI community.
          </AlertDescription>
        </Alert>

        <div id="prohibited-conduct" className="scroll-mt-20 space-y-4">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Prohibited Conduct</h3>

          <div id="dishonesty" className="space-y-3">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Dishonesty</h4>
            <p className="leading-7">
              The public deserves an honest professional in every setting. Honesty is required of all students in the
              Health Care Profession. Dishonest conduct may include but not limited to:
            </p>
            <ul className="ml-6 list-disc space-y-2 leading-7">
              <li>Knowingly reporting a false emergency</li>
              <li>Knowingly making false accusation of misconduct</li>
              <li>Misuse or falsification of school documents</li>
              <li>Forgery, alteration, or improper transfer of documents</li>
            </ul>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                A dishonest student presents a risk to clients, self and to the reputation of both the profession and
                the College. When dishonest behavior is discovered, disciplinary procedures shall be followed.
              </AlertDescription>
            </Alert>
          </div>

          <div className="space-y-3">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Other Prohibited Behaviors</h4>
            <ul className="ml-6 list-disc space-y-2 leading-7">
              <li>
                <strong>Abusive Criticism:</strong> Use of abusive language or disruptive behavior toward faculty or
                staff
              </li>
              <li>
                <strong>Destruction of Property:</strong> Damage to College property or property of others
              </li>
              <li>
                <strong>Dangerous Weapons:</strong> Use, storage, or possession of firearms, ammunition, knives or
                fireworks
              </li>
              <li>
                <strong>Theft:</strong> Theft or unauthorized use of college property or services
              </li>
              <li>
                <strong>Drugs and Alcohol:</strong> Use, production, distribution, sale, or possession is prohibited
              </li>
              <li>
                <strong>Disorderly Conduct:</strong> Conduct that unreasonably interferes with college activities
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Policies */}
      <section id="policies" className="scroll-mt-20 space-y-6">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Student Policies and Procedures
        </h2>

        {/* Admission Policy */}
        <div id="admission" className="scroll-mt-20 space-y-3">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Admission Policy</h3>
          <Card>
            <CardHeader>
              <CardTitle>Standard Policy Statement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="leading-7">
                CBMTI upholds the principle that all applicants seeking to enroll are treated fairly and equitably. The
                college has open, fair and transparent procedures based on clearly defined entry criteria.
              </p>
              <div className="space-y-2">
                <p className="font-semibold">Application Methods:</p>
                <ul className="ml-6 list-disc space-y-1">
                  <li>Online via email: info@codebluemedical.co.ke</li>
                  <li>Hand delivery</li>
                  <li>Posted via website at www.codebluemedical.co.ke</li>
                </ul>
              </div>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Admission shall only be processed upon submission of all relevant documents. Admission requirements
                  are course specific.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Fee Policy */}
        <div id="fees" className="scroll-mt-20 space-y-3">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">No Return Policy for Fees</h3>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              All fees from application, admission, short course or any other fees once paid to the school are{" "}
              <strong>NON-REFUNDABLE</strong>. Every student has the option of deferment for the period as provided in
              their admission letters.
            </AlertDescription>
          </Alert>
        </div>

        {/* Attendance */}
        <div id="attendance" className="scroll-mt-20 space-y-3">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Class Attendance</h3>
          <Card>
            <CardHeader>
              <CardTitle>Mandatory Attendance Policy</CardTitle>
              <CardDescription>
                CBMTI is a centre of excellence in training; we strive to produce competent graduates who shall
                administer safe, quality healthcare interventions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold">Official Hours:</p>
                <ul className="ml-6 list-disc space-y-1">
                  <li>Monday to Friday: 0800 hours - 1700 hours</li>
                  <li>Saturday: 9:00 AM - 5:00 PM</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold">Attendance Requirements:</p>
                <ul className="ml-6 list-disc space-y-1">
                  <li>Students are required to attend 100% of all class sessions</li>
                  <li>Arriving within 10 minutes = marked late</li>
                  <li>Arriving after 10 minutes = marked absent</li>
                  <li>Three times late = one absent</li>
                  <li>Must have at least 90% attendance to be eligible for exams</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Attachment */}
        <div id="attachment" className="scroll-mt-20 space-y-3">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Student Attachment</h3>
          <Card>
            <CardHeader>
              <CardTitle>Attachment Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="leading-7">
                Students will be placed at hospitals with which the school has an MOU. Before any student is attached,
                they must meet the following requirements:
              </p>
              <ol className="ml-6 list-decimal space-y-2">
                <li>Paid at least three quarters of their total fees (inclusive of lifesaving course cost)</li>
                <li>Acquired either a BLS or FIRST AID certificate and license from CBMTI</li>
                <li>Paid for and acquired the student logbook and insurance</li>
                <li>Acquire a student assessment form</li>
              </ol>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Student Attachment is after the 2nd month of study. Students are expected to report back to school
                  immediately after their attachment period.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Deferment */}
        <div id="deferment" className="scroll-mt-20 space-y-3">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Deferment</h3>
          <p className="leading-7">
            Students may defer or postpone their training in certain circumstances. Students are encouraged to consult
            their respective class tutors prior to initiating a deferment process.
          </p>
          <div className="space-y-2">
            <p className="font-semibold">Procedure:</p>
            <ol className="ml-6 list-decimal space-y-1 leading-7">
              <li>Pick the deferment form from the admin assistant</li>
              <li>Fill and clear from all departments as guided</li>
              <li>Take the duly filled form to the HOD for approval</li>
              <li>Student ID cards must be surrendered</li>
              <li>Medical deferment requires a medical report from a licensed medical officer</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Examination Policy */}
      <section id="examination" className="scroll-mt-20 space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">Examination Policy</h2>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Student Performance Assessment is a vital element in the training of students since they guide both teaching
            and learning.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Requirements Before Final Examination</h3>
          <Card>
            <CardContent className="pt-6">
              <ol className="ml-6 list-decimal space-y-2">
                <li>Cleared all school fee and other fee arrears</li>
                <li>Acquired BLS or First Aid Certificate from CBMTI</li>
                <li>Submit fully signed and verified logbook and assessment form</li>
                <li>Passed all CATs with a mean grade of 80% or passed supplementary CAT</li>
              </ol>
            </CardContent>
          </Card>

          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Types of Examinations</h3>
          <div className="space-y-3">
            <div className="rounded-lg border border-border p-4">
              <h4 className="font-semibold">Internal Examinations</h4>
              <ul className="ml-6 list-disc space-y-1 text-sm">
                <li>Continuous Assessment Tests (CATs)</li>
                <li>Assignments</li>
                <li>Final Examinations</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border p-4">
              <h4 className="font-semibold">External Examinations</h4>
              <p className="text-sm text-muted-foreground">
                Set and regulated by national bodies: NCK, KNEC, KNDI, TVETA, CDAC, and NITA
              </p>
            </div>
          </div>

          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Supplementary Examinations</h3>
          <Card>
            <CardContent className="pt-6 space-y-3">
              <p className="leading-7">
                A supplementary exam is offered when a student attains a Fail grade in the first attempt of a final
                examination.
              </p>
              <ul className="ml-6 list-disc space-y-2">
                <li>Offered not earlier than two weeks from release of main exam results</li>
                <li>Students have 2 attempts at supplementary CAT (KES 5,000 each)</li>
                <li>Failure of 2nd supplementary exam results in automatic demotion</li>
                <li>Supplementary final exam fee: KES 7,500</li>
              </ul>
            </CardContent>
          </Card>

          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Examination Conduct</h3>
          <div className="space-y-2">
            <p className="font-semibold">Students must:</p>
            <ul className="ml-6 list-disc space-y-1 leading-7">
              <li>Arrive on time (late arrival within 30 minutes allowed, no extra time given)</li>
              <li>Present student ID card and exam card</li>
              <li>Not bring mobile phones or unauthorized materials</li>
              <li>Remain seated until papers are collected</li>
              <li>Follow all invigilator instructions</li>
            </ul>
          </div>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Zero Tolerance for Examination Irregularities:</strong> Any proven irregularity will result in
              immediate and appropriate action including suspension or expulsion.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Academic Integrity */}
      <section id="academic-integrity" className="scroll-mt-20 space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
          Student Academic Integrity Policy
        </h2>

        <p className="leading-7">
          It is the responsibility of all CBMTI students to ensure that all academic work submitted as part of their
          coursework meets the College test for academic integrity.
        </p>

        <div id="academic-dishonesty" className="scroll-mt-20 space-y-3">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Academic Dishonesty</h3>
          <p className="leading-7">It shall be deemed a breach to:</p>
          <ul className="ml-6 list-disc space-y-2 leading-7">
            <li>Collaborate improperly on academic work</li>
            <li>Violate course rules or program regulations</li>
            <li>Submit the same work for multiple courses without approval</li>
            <li id="plagiarism">Submit plagiarized work</li>
            <li>Provide or receive information during examinations</li>
            <li>Use unauthorized materials during examinations</li>
            <li>Submit false or altered documents</li>
            <li>Forge signatures or attendance records</li>
            <li>Misrepresent academic credentials</li>
          </ul>
        </div>

        <div id="penalties" className="scroll-mt-20 space-y-3">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Penalties</h3>
          <Card>
            <CardHeader>
              <CardTitle>Disciplinary Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3">The following penalties may be applied:</p>
              <ul className="ml-6 list-disc space-y-1">
                <li>Reduction of mark on academic work</li>
                <li>Mark of zero for the work</li>
                <li>Reduction of overall course grade</li>
                <li>Failing mark with transcript notation</li>
                <li>Cancellation of admission/enrollment</li>
                <li>Suspension</li>
                <li>Expulsion</li>
                <li>Rescinding of certificate/diploma</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Harassment */}
      <section id="harassment" className="scroll-mt-20 space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">Harassment Policy</h2>

        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            The College has a zero tolerance to all forms of harassment. Any proven harassment will result in immediate
            and appropriate action.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-3">Sexual Harassment</h3>
            <p className="leading-7">
              Sexual harassment is defined as unwanted sexual advances, requests for sexual favour, and/or other verbal,
              written, visual, or physical sexual conduct. This includes:
            </p>
            <ul className="ml-6 list-disc space-y-1 mt-2">
              <li>Non-consensual sexual intercourse</li>
              <li>Non-consensual sexual contact</li>
              <li>Sexual exploitation</li>
              <li>Indecent exposure</li>
            </ul>
          </div>

          <div>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-3">
              Harassment Based on Race/Ethnicity or National Origin
            </h3>
            <p className="leading-7">
              Unwelcome verbal, written or physical conduct based on a person&apos;s actual or perceived race, ethnicity or
              national origin that unreasonably interferes with work or academic performance.
            </p>
          </div>
        </div>
      </section>

      {/* Student Services */}
      <section id="student-services" className="scroll-mt-20 space-y-6">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">Student Services</h2>

        {/* Health Management */}
        <div id="health" className="scroll-mt-20 space-y-3">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Personal Health Management</h3>
          <Card>
            <CardContent className="pt-6 space-y-3">
              <p className="leading-7">Health requirements must be taken care of to participate in training:</p>
              <ul className="ml-6 list-disc space-y-2">
                <li>All students must have active personal accident and medical insurance on admission</li>
                <li>Students must avail themselves for pre-entry medical examination</li>
                <li>In case of sickness, the school will call an ambulance at guardian/student&apos;s cost</li>
                <li>Medical clearance required for participation during pregnancy and after delivery</li>
                <li>Students with communicable diseases must provide medical evidence</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Mentorship */}
        <div id="mentorship" className="scroll-mt-20 space-y-3">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Mentorship</h3>
          <p className="leading-7">
            Mentorship is required to offer students support and guidance in the practice area by nurturing and focusing
            on professional development.
          </p>
          <ul className="ml-6 list-disc space-y-2">
            <li>Every student must have a named mentor for each period of learning</li>
            <li>At least 70% of practice time must be supervised by a mentor</li>
            <li>Mentors assess competence and confirm safe and effective practice</li>
            <li>Sign-off mentors make final practice assessments</li>
          </ul>
        </div>

        {/* Student Records */}
        <div id="records" className="scroll-mt-20 space-y-3">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Student Record Files</h3>
          <Card>
            <CardHeader>
              <CardTitle>Record Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="leading-7">
                Student files shall be retained for 3 years following graduation and 1 year following withdrawal.
              </p>
              <div>
                <p className="font-semibold">Services:</p>
                <ul className="ml-6 list-disc space-y-1">
                  <li>Certification of transcripts and certificates (request 2 weeks in advance)</li>
                  <li>Lost certificate replacement: KES 5,000 (police abstract required)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graduation */}
        <div id="graduation" className="scroll-mt-20 space-y-3">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Graduation</h3>
          <Card>
            <CardHeader>
              <CardTitle>Graduation Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert>
                <GraduationCap className="h-4 w-4" />
                <AlertDescription>
                  Graduation is a college requirement and MUST be attended by the graduating student; failure to which
                  the student shall be penalized.
                </AlertDescription>
              </Alert>
              <div>
                <p className="font-semibold">Procedure:</p>
                <ol className="ml-6 list-decimal space-y-1">
                  <li>Pick graduation clearance form from admin assistant</li>
                  <li>Clear from all departments</li>
                  <li>Submit to HOD for approval</li>
                  <li>Pay graduation fee (KES 2,500)</li>
                  <li>Surrender student ID card</li>
                  <li>Pick gown on rehearsal day</li>
                  <li>Return gown within 3 days (KES 250/day penalty after)</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Suspension */}
      <section id="suspension" className="scroll-mt-20 space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">Suspension Policy</h2>

        <p className="leading-7">
          Suspension is a forced, temporary leave from the College for behavioral adjustment purposes. The Head of
          Department may suspend a student for not less than 14 calendar days.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Immediate Suspension Grounds</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3">A student must be suspended immediately if they:</p>
            <ul className="ml-6 list-disc space-y-1">
              <li>Are physically violent resulting in injury</li>
              <li>Are in possession of a firearm or prohibited weapon</li>
              <li>Use, supply, or possess illegal substances or alcohol</li>
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <p className="font-semibold">During suspension, students shall not:</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Attend classes</li>
            <li>Use college facilities</li>
            <li>Participate in student activities</li>
            <li>Attend clinical placements</li>
            <li>Be members of student organizations</li>
          </ul>
        </div>
      </section>

      {/* Expulsion */}
      <section id="expulsion" className="scroll-mt-20 space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">Expulsion Policy</h2>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Expulsion means the permanent deregistration of the student from the college.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Grounds for Expulsion</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3">A student may be expelled on any of the following grounds:</p>
            <ol className="ml-6 list-decimal space-y-2">
              <li>Persistent willful violation of College code of conduct after previous suspension</li>
              <li>Willful conduct that significantly disrupts the rights of others to education</li>
              <li>Willful conduct that endangers the student, other students, or faculty</li>
            </ol>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <p className="font-semibold">Due Process:</p>
          <ul className="ml-6 list-disc space-y-1">
            <li>Written notice provided to student and parent/guardian</li>
            <li>Hearing scheduled within 10 days of notice</li>
            <li>Student may have representation</li>
            <li>Only the disciplinary team may expel a student</li>
            <li>Relevant authority notified within 30 days</li>
          </ul>
        </div>
      </section>

      {/* Dress Code */}
      <section id="dress-code" className="scroll-mt-20 space-y-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">Dress Code Policy</h2>

        <Card>
          <CardHeader>
            <CardTitle>Standard Uniform</CardTitle>
            <CardDescription>
              College uniform identifies an individual as a student and reflects a positive and professional image
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold mb-2">Attire Requirements:</p>
              <ul className="ml-6 list-disc space-y-1">
                <li>Blue scrubs with college logo embroidered on left breast</li>
                <li>Black socks and black leather shoes</li>
                <li>Trousers shall not be tight fitting</li>
                <li>Black fleece/sweater or white/black pull neck may be worn in cold weather</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold mb-2">Name Tag & ID Badge:</p>
              <ul className="ml-6 list-disc space-y-1">
                <li>Name tags issued 2 weeks after admission</li>
                <li>Worn on upper right portion of uniform at all times</li>
                <li>Charges apply for replacement of lost name tags</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold mb-2">Hair and Nails:</p>
              <ul className="ml-6 list-disc space-y-1">
                <li>Hair must be above collar or tied back securely</li>
                <li>Hair colors not permitted</li>
                <li>Male students must be clean shaven or have neatly trimmed beard</li>
                <li>Fingernails clean, trimmed, no polish or artificial nails</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold mb-2">Jewelry:</p>
              <ul className="ml-6 list-disc space-y-1">
                <li>Only one small pin earring in each ear allowed</li>
                <li>Dangling earrings and bracelets prohibited</li>
                <li>Jewelry must be removed from other pierced locations</li>
                <li>Tattoos should not be visible</li>
                <li>Watch with second hand or digital watch required</li>
              </ul>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Gum chewing and mobile phones are not allowed during class sessions and college appointments. Strong
                scented perfumes and lotions are prohibited.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </section>

      {/* Footer Navigation */}
      <Separator className="my-8" />

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Was this helpful?</div>
      </div>
    </div>
  )
}
