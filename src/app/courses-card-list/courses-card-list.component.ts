import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CourseDialogComponent } from '../course-dialog/course-dialog.component';
import { Course } from '../model/course';
import { filter, tap } from 'rxjs/operators';

@Component({
    selector: 'courses-card-list',
    templateUrl: './courses-card-list.component.html',
    styleUrls: ['./courses-card-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursesCardListComponent {

    @Input() courses: Course[] = [];
    @Output() private coursesChanged = new EventEmitter();

    constructor(private dialog: MatDialog) {}

    editCourse(course: Course) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = "400px";
        dialogConfig.data = course;
        const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);
        dialogRef.afterClosed()
            .pipe(
                filter(val => !!val),
                tap(() => this.coursesChanged.emit(null))
            )
            .subscribe()
    }
}
