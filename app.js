$(document).ready(
    function(){
        $(".form-group-time-quantum").show(1000);

        var processList = [];

        $('#btnAddProcess').on('click', function(){
            var processID = $('#processID');
            var arrivalTime = $('#arrivalTime');
            var burstTime = $('#burstTime');

            if(processID.val() === '' || arrivalTime.val() === '' || burstTime.val() === ''){
                processID.addClass('is-invalid');
                arrivalTime.addClass('is-invalid');
                burstTime.addClass('is-invalid');
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
        function roundRobin() {
          var timeQuantum = $('#timeQuantum');
          var timeQuantumVal= parseInt(timeQuantum.val(), 10);
          if(timeQuantum.val() ==''){
              alert('Please enter time quantum');
              timeQuantum.addClass('is-invalid');
              return;
          }
          var completedList = [];
          var time = 0;
          var queue = [];
          var i = 0;
          var D = 0;
          while (processList.length > 0 || queue.length > 0) {
              addToQueue();
              while (queue.length == 0) {               
                  time++;
                  addToQueue();
              }
              // console.log(i);
              selectProcessForRR();
              i = 1;
          }

          function addToQueue() {
              for(var i = 0; i < processList.length; i++) {
                  if(processList[i].arrivalTime === time) {
                      var process = {
                          processID: processList[i].processID, 
                          arrivalTime: processList[i].arrivalTime, 
                          burstTime: processList[i].burstTime
                      }
                      processList.splice(i, 1);
                      queue.push(process);
                  }
                }
              }
              function selectProcessForRR() {

                console.log(queue[0].processID + " " + queue[queue.length-1].processID);  
                let coun = 0;
                if (queue.length!=0) {
                    if (D == 0){
                    if (i == 1 ){
                  var q = queue.shift();}}
                  D = 0;
                //   queue.push(q);
                  
                if(queue.length==0 )
                {queue.push(q);
                    // console.log(q.processID);
                coun = 1;
                }
                
                console.log(queue[0].processID + " " + queue[queue.length-1].processID);    
                  if (queue[0].burstTime < timeQuantumVal) {
                    D = 1;
                      process = queue.shift();
                    //   console.log(process.processID);
                      process.completedTime = time + process.burstTime;
                          
                      for (var index = 0; index < process.burstTime; index++) {
                          time++;
                          addToQueue(); 
                      }
                      completedList.push(process);

                  }
                  else if(queue[0].burstTime == timeQuantumVal){
                      process = queue.shift();
                      D = 1;
                    //   console.log(process.processID);
                      process.completedTime = time + timeQuantumVal;
                      completedList.push(process);

                      for (var index = 0; index < timeQuantumVal; index++) {
                          time++;
                          addToQueue();   
                      }
                  }  
                  else if(queue[0].burstTime > timeQuantumVal){
                      process = queue[0];
                    //   console.log(process.processID);
                      queue[0].burstTime = process.burstTime - timeQuantumVal;

                      for (var index = 0; index < timeQuantumVal; index++) {
                          time++;
                          addToQueue();
                      }
                  }  
                  if (q != null){
                  if(i == 1){
                  if (coun != 1 ){
                  queue.push(q);
                //   console.log(q.processID);
                  }}}
                  
                   
              }
          }

          // Fetch initial table data
          var TableData = [];
          $('#tblProcessList tr').each(function(row, tr) {
              TableData[row] = {
                  "processID": parseInt($(tr).find('td:eq(0)').text()),
                  "arrivalTime": parseInt($(tr).find('td:eq(1)').text()),
                  "burstTime": parseInt($(tr).find('td:eq(2)').text())
              }
          });

          // Remove table header row
          TableData.splice(0, 1);
          
          // Reset burst time from original input table.
          TableData.forEach(pInTable => {
              completedList.forEach(pInCompleted => {
                  if (pInTable.processID==pInCompleted.processID) {
                      pInCompleted.burstTime= pInTable.burstTime;
                      pInCompleted.turnAroundTime = pInCompleted.completedTime - pInCompleted.arrivalTime;
                      pInCompleted.waitingTime = pInCompleted.turnAroundTime - pInCompleted.burstTime;
                  }
              });
          });

          // Bind table data
          $.each(completedList, function(key, process){
              $('#tblResults > tbody:last-child').append(
                  `<tr>
                      <td id="tdProcessID">${process.processID}</td>
                      <td id="tdArrivalTime">${process.arrivalTime}</td>
                      <td id="tdBurstTime">${process.burstTime}</td>
                      <td id="tdBurstTime">${process.completedTime}</td>
                      <td id="tdBurstTime">${process.waitingTime}</td>
                      <td id="tdBurstTime">${process.turnAroundTime}</td>
                  </tr>`
              );
          });
              
          // Get average
          var totalTurnaroundTime = 0;
          var totalWaitingTime = 0;
          var maxCompletedTime = 0;

          $.each(completedList, function(key, process){
              if (process.completedTime > maxCompletedTime) {
                  maxCompletedTime = process.completedTime;
              }
              totalTurnaroundTime = totalTurnaroundTime + process.turnAroundTime;
              totalWaitingTime = totalWaitingTime + process.waitingTime;
          });

          $('#avgTurnaroundTime').val( totalTurnaroundTime / completedList.length );
          $('#avgWaitingTime').val( totalWaitingTime / completedList.length );
          $('#throughput').val(completedList.length / maxCompletedTime);
          
      }    
  }
        // function Process(pid, burstTime, arrivalTime) {
        //     this.pid = pid;
        //     this.burstTime = burstTime;
        //     this.arrivalTime = arrivalTime;
        //     this.waitingTime = 0;
        //     this.turnaroundTime = 0;
        //     this.remainingTime = burstTime; // Used for tracking remaining burst time
        //   }
          
        //   function findWaitingTime(processes, timeQuantum) {
        //     let current_time = 0;
        //     let completed = 0;
        //     let queue = [];
          
        //     while (completed != processes.length) {
        //       // Add processes that arrived at current time to the queue
        //       for (let i = 0; i < processes.length; i++) {
        //         if (processes[i].arrivalTime <= current_time && !queue.includes(processes[i])) {
        //           queue.push(processes[i]);
        //         }
        //       }
          
        //       if (queue.length > 0) {
        //         let process = queue.shift();
        //         let timeSlice = Math.min(process.remainingTime, timeQuantum);
        //         process.remainingTime -= timeSlice;
        //         current_time += timeSlice;
          
        //         process.waitingTime += current_time - process.burstTime - process.arrivalTime;
          
        //         if (process.remainingTime === 0) {
        //           completed++;
        //           process.turnaroundTime = process.burstTime + process.waitingTime;
        //         } else {
        //           queue.push(process); // Add unfinished process back to the queue
        //         }
        //       } else {
        //         // No processes ready, advance time
        //         current_time++;
        //       }
        //     }
        //   }
          
        //   function findAverageTime(processes) {
        //     let avgWaitingTime = 0;
        //     let avgTurnaroundTime = 0;
          
        //     for (let process of processes) {
        //       avgWaitingTime += process.waitingTime;
        //       avgTurnaroundTime += process.turnaroundTime;
        //     }
          
        //     avgWaitingTime /= processes.length;
        //     avgTurnaroundTime /= processes.length;
          
        //     console.log("Average Waiting Time:", avgWaitingTime.toFixed(2));
        //     console.log("Average Turnaround Time:", avgTurnaroundTime.toFixed(2));
        //   }
          
        //   function roundRobin(processes, timeQuantum) {
        //     for (let process of processes) {
        //       process.remainingTime = process.burstTime; // Initialize remaining time
        //     }
          
        //     findWaitingTime(processes, timeQuantum);
          
        //     console.log("PID\tBurst Time\tArrival Time\tWaiting Time\tTurnaround Time");
        //     for (let process of processes) {
        //       console.log(`${process.pid}\t${process.burstTime}\t\t${process.arrivalTime}\t\t${process.waitingTime.toFixed(2)}\t\t${process.turnaroundTime.toFixed(2)}`);
        //     }
          
        //     findAverageTime(processes);
        //   }
          
        //   // Example usage:
        //   let processes = [
        //     new Process(1, 5, 0),
        //     new Process(2, 3, 2),
        //     new Process(3, 2, 4)
        //   ];
          
        //   let timeQuantum = 2;
          
        //   roundRobin(processes, timeQuantum);
        //   // Output
        );