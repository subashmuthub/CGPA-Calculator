import mongoose, { Document } from 'mongoose';
export interface ICourse {
    courseName: string;
    courseCode: string;
    credits: number;
    grade: string;
    gradePoint: number;
}
export interface ICGPARecord extends Document {
    userId: mongoose.Types.ObjectId;
    semester: string;
    year: string;
    courses: ICourse[];
    semesterGPA: number;
    cumulativeCGPA: number;
    totalCredits: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const CGPARecord: mongoose.Model<ICGPARecord, {}, {}, {}, mongoose.Document<unknown, {}, ICGPARecord, {}, mongoose.DefaultSchemaOptions> & ICGPARecord & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICGPARecord>;
//# sourceMappingURL=CGPARecord.d.ts.map