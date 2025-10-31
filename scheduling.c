#include<stdio.h>
int calculate_wait_time(int id,int burst_time[],int waiting_time[],int n){
    waiting_time[0] = 0;
    for(int i = 1;i<n;i++){
        waiting_time[i] = waiting_time[i-1] + burst_time[i-1];
    }
    return waiting_time[id];
}
int calculate_turnaround_time(int id,int burst_time[],int waiting_time[],int turnaround_time[],int n){
    for(int i = 0;i<n;i++){
        turnaround_time[i] = burst_time[i] + waiting_time[i];
    }
    return turnaround_time[id];
}
float calculate_average_turnaround(int turnaround_time[],int n){
    float sum = 0;
    for(int i = 0;i<n;i++){
        sum += turnaround_time[i];
    }
    return sum/n;
}
float calculate_average_waiting(int waiting_time[],int n){
    float sum = 0;
    for(int i = 0;i<n;i++){
        sum += waiting_time[i];
    }
    return sum/n;
}
int main(){
    int n;
    scanf("%d",&n);
    int burst_time[n];
    for(int i = 0;i<n;i++){
        scanf("%d",&burst_time[i]);
    }
    int waiting_time[n];
    int turnarounnd_time[n];
    for(int val = 0;val<n;val++){
    int wt = calculate_wait_time(val, burst_time, waiting_time,n);
    printf("The waiting time of process P%d is: %d\n", val, wt);
    int tat = calculate_turnaround_time(val,burst_time,waiting_time,turnarounnd_time,n);
    printf("The turnaround time of process P%d is %d\n",val,tat);
    }
    float avg_turnaround_time = calculate_average_turnaround(turnarounnd_time,n);
    float avg_waiting_time = calculate_average_waiting(waiting_time,n);
    printf("The average turnaround time is %f\n",avg_turnaround_time);
    printf("The average waiting time is %f\n",avg_waiting_time);
    
}