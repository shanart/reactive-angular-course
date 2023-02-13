import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../model/course';
import {
    startWith,
    map
} from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { Lesson } from '../model/lesson';
import { CoursesService } from '../services/courses.service';


interface CourseData {
    course: Course
    lessons: Lesson[]
}


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseComponent implements OnInit {
    data$: Observable<CourseData>;

    constructor(private route: ActivatedRoute,
                private coursesService: CoursesService) {}

    ngOnInit() {
        const courseId = parseInt(this.route.snapshot.paramMap.get('courseId'));
        const course$ = this.coursesService.loadCourseById(courseId).pipe(
            startWith(null)
        );
        const lessons$ = this.coursesService.loadCourseLessons(courseId).pipe(
            startWith([])
        );;
        this.data$ = combineLatest([course$, lessons$]).pipe(
            map(([course, lessons]) => {
                return {
                    course: course,
                    lessons: lessons
                }
            })
        );
    }
}











