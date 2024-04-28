// https://www.geeksforgeeks.org/program-for-round-robin-scheduling-for-the-same-arrival-time/
$(document).ready(
    function(){
        $(".form-group-time-quantum").show(1000);

        var processList = [];

        $('#btnAddProcess').on('click', function(){
            var processID = $('#processID');
            var arrivalTime = $('#arrivalTime');
            var burstTime = $('#burstTime');

            if(processID.val() === '' || arrivalTime.val() === '' || burstTime.val() === ''){
                // processID.addClass('is-invalid');
                // arrivalTime.addClass('is-invalid');
                // burstTime.addClass('is-invalid');
                return;
            }

            var process = {
                processID: parseInt(processID.val(), 10),
                arrivalTime: parseInt(arrivalTime.val(), 10),
                burstTime: parseInt(burstTime.val(), 10)
            }

            processList.push(process);
            
            $('#tblProcessList > tbody:last-child').append(
                `<tr>
                    <td id="tdProcessID">${processID.val()}</td>
                    <td id="tdArrivalTime">${arrivalTime.val()}</td>
                    <td id="tdBurstTime">${burstTime.val()}</td>
                </tr>`
            );

            processID.val('');
            arrivalTime.val('');
            burstTime.val('');
        });
//////////////////////////////////////////
        $('#btnCalculate').on('click', function(){

            if (processList.length == 0) {
                alert('Please insert some processes');
                return;
            }
            else roundRobin();
            
        });
        function Process(pid, burstTime, arrivalTime) {
            this.pid = pid;
            this.burstTime = burstTime;
            this.arrivalTime = arrivalTime;
            this.waitingTime = 0;
            this.turnaroundTime = 0;
            this.remainingTime = burstTime; // Used for tracking remaining burst time
          }
          
          function findWaitingTime(processes, timeQuantum) {
            let current_time = 0;
            let completed = 0;
            let queue = [];
          
            while (completed != processes.length) {
              // Add processes that arrived at current time to the queue
              for (let i = 0; i < processes.length; i++) {
                if (processes[i].arrivalTime <= current_time && !queue.includes(processes[i])) {
                  queue.push(processes[i]);
                }
              }
          
              if (queue.length > 0) {
                let process = queue.shift();
                let timeSlice = Math.min(process.remainingTime, timeQuantum);
                process.remainingTime -= timeSlice;
                current_time += timeSlice;
          
                process.waitingTime += current_time - process.burstTime - process.arrivalTime;
          
                if (process.remainingTime === 0) {
                  completed++;
                  process.turnaroundTime = process.burstTime + process.waitingTime;
                } else {
                  queue.push(process); // Add unfinished process back to the queue
                }
              } else {
                // No processes ready, advance time
                current_time++;
              }
            }
          }
          
          function findAverageTime(processes) {
            let avgWaitingTime = 0;
            let avgTurnaroundTime = 0;
          
            for (let process of processes) {
              avgWaitingTime += process.waitingTime;
              avgTurnaroundTime += process.turnaroundTime;
            }
          
            avgWaitingTime /= processes.length;
            avgTurnaroundTime /= processes.length;
          
            console.log("Average Waiting Time:", avgWaitingTime.toFixed(2));
            console.log("Average Turnaround Time:", avgTurnaroundTime.toFixed(2));
          }
          
          function roundRobin(processes, timeQuantum) {
            for (let process of processes) {
              process.remainingTime = process.burstTime; // Initialize remaining time
            }
          
            findWaitingTime(processes, timeQuantum);
          
            console.log("PID\tBurst Time\tArrival Time\tWaiting Time\tTurnaround Time");
            for (let process of processes) {
              console.log(`${process.pid}\t${process.burstTime}\t\t${process.arrivalTime}\t\t${process.waitingTime.toFixed(2)}\t\t${process.turnaroundTime.toFixed(2)}`);
            }
          
            findAverageTime(processes);
          }
          
          // Example usage:
          let processes = [
            new Process(1, 5, 0),
            new Process(2, 3, 2),
            new Process(3, 2, 4)
          ];
          
          let timeQuantum = 2;
          
          roundRobin(processes, timeQuantum);
          // Output
        });