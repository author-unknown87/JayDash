export type Education = {
    description: string,
    endDate: string,
    gpa: string,
    institution: string,
    primaryKey: number,
    program: string,
    startDate: string
}

export type IndustryTool = {
    primaryKey: number,
    toolName: string
}

export type Skill = {
    primaryKey: number,
    skillName: string,
    startDate: string
}

export type Workplace = {
    companyName: string,
    currentPosition: boolean,
    endDate?: string,
    jobDescription: string,
    position: string,
    primaryKey: number,
    startDate: string
}

export type ResumeData = {
    education: Education[],
    industryTools: IndustryTool[]
    skills: Skill[],
    workplaces: Workplace[]
}