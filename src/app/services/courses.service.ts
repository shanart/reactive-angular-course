import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Course } from "../model/course";
import { map, share, shareReplay } from "rxjs/operators";
import { Lesson } from "../model/lesson";


@Injectable({
    providedIn: 'root'
})
export class CoursesService {

    constructor(private http: HttpClient) {}

    loadAllCourses(): Observable<Course[]> {
        return this.http.get<Course[]>("/api/courses").pipe(
            map(res => res['payload']),
            shareReplay()
        );
    }

    saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
        return this.http.put(`/api/courses/${courseId}`, changes).pipe(
            shareReplay()
        );
    }

    searchLesson(search: string): Observable<Lesson[]>{
        return this.http.get<Lesson[]>("/api/lessons/", {
            params: {
                filter: search,
                pageSize: 100
            }
        }).pipe(
            map(response => response["payload"]),
            shareReplay()
        );
    }

    loadCourseLessons(courseId: number): Observable<Lesson[]> {
        return this.http.get<Lesson[]>("/api/lessons/", {
            params: {
                pageSize: 1000000,
                courseId: courseId.toString()
            }
        }).pipe(
            map(response => response["payload"]),
            shareReplay()
        )
    }

    loadCourseById(courseId: number): Observable<Course> {
        return this.http.get<Course>(`/api/courses/${courseId}`).pipe(
            shareReplay()
        )
    }

}