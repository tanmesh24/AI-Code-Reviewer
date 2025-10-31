#include <stdio.h>
#include <stdarg.h>
#include <stddef.h>
#include <setjmp.h>
#include <cmocka.h>

int calculate_wait_time(int id, int burst_time[], int waiting_time[], int n) {
    waiting_time[0] = 0;
    for (int i = 1; i < n; i++) {
        waiting_time[i] = waiting_time[i - 1] + burst_time[i - 1];
    }
    return waiting_time[id];
}

int calculate_turnaround_time(int id, int burst_time[], int waiting_time[], int turnaround_time[], int n) {
    for (int i = 0; i < n; i++) {
        turnaround_time[i] = burst_time[i] + waiting_time[i];
    }
    return turnaround_time[id];
}

float calculate_average_turnaround(int turnaround_time[], int n) {
    float sum = 0;
    for (int i = 0; i < n; i++) {
        sum += turnaround_time[i];
    }
    return sum / n;
}

float calculate_average_waiting(int waiting_time[], int n) {
    float sum = 0;
    for (int i = 0; i < n; i++) {
        sum += waiting_time[i];
    }
    return sum / n;
}

// ----------------- Unit Tests --------------------

static void test_calculate_wait_time(void **state) {
    (void)state;
    int burst[] = {5, 3, 8};
    int wt[3];
    int result = calculate_wait_time(2, burst, wt, 3);

    assert_int_equal(wt[0], 0);
    assert_int_equal(wt[1], 5);
    assert_int_equal(wt[2], 8);
    assert_int_equal(result, 8);
}

static void test_calculate_turnaround_time(void **state) {
    (void)state;
    int burst[] = {5, 3, 8};
    int wt[] = {0, 5, 8};
    int tat[3];
    int result = calculate_turnaround_time(2, burst, wt, tat, 3);

    assert_int_equal(tat[0], 5);
    assert_int_equal(tat[1], 8);
    assert_int_equal(tat[2], 16);
    assert_int_equal(result, 16);
}

// ----------------- Main --------------------

int main(void) {
    int choice;
    printf("Choose mode:\n1. Run Scheduling\n2. Run Unit Tests\nEnter choice: ");
    scanf("%d", &choice);

    if (choice == 1) {
        int n;
        printf("Enter number of processes: ");
        scanf("%d", &n);
        int burst_time[n];
        printf("Enter burst times: ");
        for (int i = 0; i < n; i++) {
            scanf("%d", &burst_time[i]);
        }
        int waiting_time[n], turnaround_time[n];
        for (int i = 0; i < n; i++) {
            int wt = calculate_wait_time(i, burst_time, waiting_time, n);
            printf("Waiting time of process P%d: %d\n", i, wt);
            int tat = calculate_turnaround_time(i, burst_time, waiting_time, turnaround_time, n);
            printf("Turnaround time of process P%d: %d\n", i, tat);
        }
        float avg_wt = calculate_average_waiting(waiting_time, n);
        float avg_tat = calculate_average_turnaround(turnaround_time, n);
        printf("Average Waiting Time: %f\n", avg_wt);
        printf("Average Turnaround Time: %f\n", avg_tat);
        return 0;
    } else {
        const struct CMUnitTest tests[] = {
            cmocka_unit_test(test_calculate_wait_time),
            cmocka_unit_test(test_calculate_turnaround_time),
        };
        return cmocka_run_group_tests(tests, NULL, NULL);
    }
}
