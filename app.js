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
        function roundRobin() {
              
    }
);