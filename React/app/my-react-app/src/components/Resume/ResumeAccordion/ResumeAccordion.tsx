import { 
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
 } from "../../ui/accordion"

 import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
 } from "../../ui/table"

 import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
 } from "../../ui/card"

 import styles from './ResumeAccordion.module.scss'
 import ResumeTableRow from "./TableRow/ResumeTableRow"

export default function ResumeAccordion() {

    return (
        <>
            <Accordion type="multiple">
                <AccordionItem value="skills" className={styles.AccordionItem}>
                    <AccordionTrigger className={styles.AccordionTrigger}>Technical Skills</AccordionTrigger>
                    <AccordionContent>
                        <Table className="mb-4">
                            <TableHeader>
                                <TableRow className={styles.TableRow}>
                                    <TableHead>Skill name</TableHead>
                                    <TableHead>Years of Experience</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <ResumeTableRow skillName="C#" startDate="01-06-2020"/>
                                <ResumeTableRow skillName=".NET" startDate="01-06-2020"/>
                                <ResumeTableRow skillName="SQL" startDate="01-06-2020"/>
                                <ResumeTableRow skillName="React" startDate="06-10-2024"/>
                                <ResumeTableRow skillName="CI/CD Pipelines" startDate="03-01-2026"/>
                                <ResumeTableRow skillName="Python" startDate="03-01-2026"/>
                            </TableBody>
                        </Table>
                        <Card>
                            <CardHeader>
                                <CardTitle>Industry Tools</CardTitle>
                                <CardDescription>Various tools I am comfortable and familiar with</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className={styles.ToolsList}>
                                    <li>Visual Studio</li>
                                    <li>VSCode</li>
                                    <li>SSMS</li>
                                    <li>Github Desktop / Git Extensions / Git Kraken</li>
                                    <li>Github</li>
                                    <li>Github Actions</li>
                                    <li>LINQPad</li>
                                    <li>Jira</li>
                                    <li>Monday.com</li>
                                    <li>Confluence</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="history" className={styles.AccordionItem}>
                    <AccordionTrigger className={styles.AccordionTrigger}>Work History</AccordionTrigger>
                    <AccordionContent>
                        <Card className={styles.JobCard}>
                            <CardHeader>
                                <CardTitle>Kardex Remstar</CardTitle>
                                <CardDescription className={styles.HistoryDetails}>
                                    <div className={styles.JobTitle}>
                                        Software Developer
                                    </div>
                                    <div className={styles.Timeline}>
                                        June 2024 - Present
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam dapibus ipsum nec sapien blandit tristique. Etiam diam mi, accumsan malesuada sem vitae, interdum cursus arcu. Mauris eu hendrerit eros. Nulla vitae augue at arcu congue pulvinar in suscipit risus. Quisque vulputate ac lacus nec tristique. In ultricies consectetur tellus, a mollis felis vehicula sit amet. Ut porta euismod mauris, sed ultricies orci scelerisque sit amet. Praesent laoreet nunc in mi tincidunt accumsan. Morbi vehicula libero eget magna tristique, ut luctus justo luctus. Curabitur porttitor iaculis quam, a efficitur metus.</p>
                            </CardContent>
                        </Card>
                        <Card className={styles.JobCard}>
                            <CardHeader>
                                <CardTitle>Tire Discounters</CardTitle>
                                <CardDescription className={styles.HistoryDetails}>
                                    <div className={styles.JobTitle}>
                                        .NET Developer (Contractor)
                                    </div>
                                    <div className={styles.Timeline}>
                                        January 2024 - June 2024
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Support of existing Web API (Rest) solution using C# and .NET Core 6.0 technology as part of a fast paced, Agile development team.  Responsible for developing new controllers/endpoints that interact with SQL Server databases via Entity Framework.  Interpreting existing manual business logic into supportable programmatic solutions.  Establishing solid unit testing around all new development where feasible to ensure consistent regression testing for future efforts.  Strong emphasis on best industry practices for C# development.  Integration with AWS in a C# web service to pull JSON from a DynamoDB table.</p>
                            </CardContent>
                        </Card>
                        <Card className={styles.JobCard}>
                            <CardHeader>
                                <CardTitle>The Cincinnati Insurance Companies</CardTitle>
                                <CardDescription className={styles.HistoryDetails}>
                                    <div className={styles.JobTitle}>
                                        Software Developer II
                                    </div>
                                    <div className={styles.Timeline}>
                                        January 2020 - December 2023
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>.NET web development utilizing C#, HTML, CSS, and Javascript to create and maintain ASP.NET MVC web applications.  Heavy use of SQL with a SQL Server database to perform basic CRUD operations.  Complex views and stored procedures written in SQL as needed.  Developed and maintained RESTful web service that fetched, serialized, and distributed XML to enterprise shared services for Big Data analysis purposes.  Heavy use of XSLT to transform XML files created from web service mentioned earlier.  Upgrading legacy applications on .NET Framework up to .NET Core 6.  Strong, consistent use of MVC code design in all applicable applications</p>
                            </CardContent>
                        </Card>
                        <Card className={styles.JobCard}>
                            <CardHeader>
                                <CardTitle>Kroger Tech</CardTitle>
                                <CardDescription className={styles.HistoryDetails}>
                                    <div className={styles.JobTitle}>
                                        Tech Support CTR Analyst 1
                                    </div>
                                    <div className={styles.Timeline}>
                                        April 2018 - December 2020
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Resolving inbound support phone calls using a wide array of enterprise specific applications.  Escalating issues to appropriate teams through in-house ticketing system.  Inter-departmental collaboration to resolve larger issues as they arise</p>
                            </CardContent>
                        </Card>
                        <Card className={styles.JobCard}>
                            <CardHeader>
                                <CardTitle>Luxottica</CardTitle>
                                <CardDescription className={styles.HistoryDetails}>
                                    <div className={styles.JobTitle}>
                                        Workforce Management Data Analyst
                                    </div>
                                    <div className={styles.Timeline}>
                                        February 2014 - April 2018
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Maintained call center employee schedules.  Managed time off requests versus staffing needs.  Analyzed historical call data for forecasting, staffing, and ensuring client performance guarantee goals.  Completed various data-oriented ad hoc reports for partner departments.</p>
                            </CardContent>
                        </Card>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="education" className={styles.AccordionItem}>
                    <AccordionTrigger className={styles.AccordionTrigger}>Education</AccordionTrigger>
                    <AccordionContent>
                        <Card>
                            <CardHeader>
                                <CardTitle>Associate of Applied Science</CardTitle>
                                <CardDescription>Cincinnati State Technical College</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableRow>
                                        <TableCell>Dates Attended</TableCell>
                                        <TableCell>September 2016 - January 2020</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>GPA</TableCell>
                                        <TableCell>3.5</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Program</TableCell>
                                        <TableCell>Business Systems Programming and Analytics</TableCell>
                                    </TableRow>
                                </Table>
                            </CardContent>
                        </Card>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </>
    )
}