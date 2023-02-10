import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { Course, sortCoursesBySeqNo } from "../model/course";

@Injectable({
    providedIn: 'root'
})
export class CoursesStore {

    private subject = new BehaviorSubject<Course[]>([]);
    courses$: Observable<Course[]> = this.subject.asObservable();

    constructor(private http: HttpClient,
                private loadingService: LoadingService,
                private messagesService: MessagesService) {
        this.loadAllCourses();
    }

    filterByCategory(category: string): Observable<Course[]> {
        // FIlter course by category and sort by sequential number
        return this.courses$
            .pipe(map((courses: Course[]) => courses.filter((course: Course) => course.category === category).sort(sortCoursesBySeqNo)))
    }

    saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
        const courses = this.subject.getValue();
        const index = courses.findIndex(course => course.id == courseId);
        const newCourse: Course = {
            ...courses[index],
            ...changes
        }
        const newCourses: Course[] = courses.slice(0);
        newCourses[index] = newCourse;
        this.subject.next(newCourses);
        return this.http.put(`/api/courses/${courseId}`, changes)
            .pipe(
                catchError(err => {
                    const message = "Could not save courses";
                    console.log(message, err);
                    this.messagesService.showErrors(message);
                    return throwError(message);
                }),
                shareReplay()
            );
    }

    private loadAllCourses() {
        const loadCourses$ = this.http.get<Course[]>('/api/courses')
            .pipe(
                map(response => response['payload']),
                catchError(err => {
                    const message = "Could not load courses";
                    this.messagesService.showErrors(message);
                    console.log(message, err);
                    return throwError(message);
                }),
                tap(courses => this.subject.next(courses))
            );
        this.loadingService.showLoaderUntilComplited(loadCourses$).subscribe();
    }
}