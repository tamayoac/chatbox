angular.module('chatbox', [])
    .controller('ChatController', ['$scope', '$window', '$timeout','$log', function($scope, $window, $timeout, $log) {
        let vm = this;
        vm.messages = [];
        vm.userName = '';
        vm.message = '';
        vm.pageSize = 25;

        // Prompt for user name
        vm.userName = prompt("Please enter your name:");

        // Initialize or load messages
        vm.loadMessages = function() {
            let savedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
            vm.messages = savedMessages.slice(-vm.pageSize);
        };

        vm.loadMessages();


        vm.sendMessage = function() {
            if (vm.message.trim() !== '') {
                let newMessage = { user: vm.userName, message: vm.message, timestamp: new Date().toISOString() };
                let savedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
                savedMessages.push(newMessage);
                localStorage.setItem('chatMessages', JSON.stringify(savedMessages));
                vm.messages.push(newMessage);
                vm.message = ''; // Clear message input
                console.log("sendMessage called");
                vm.scrollToBottom(); // Scroll to the bottom
            }
        };

        vm.scrollToBottom = function() {
            $timeout(function() {
                var messageListElement = document.getElementById('messageList');
                messageListElement.scrollTop = messageListElement.scrollHeight;
            }, 0); // You can adjust the delay here as well
        };
        $timeout(vm.scrollToBottom, 0);
        // Listen for messages from other tabs
        angular.element($window).on('storage', function(event) {
            if (event.key === 'chatMessages') {
                vm.loadMessages();
                $scope.$apply();
            }
        });
    }]);
