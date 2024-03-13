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
        vm.timeAgo = function(isoDate) {
            const now = new Date();
            const messageDate = new Date(isoDate);
            const diffInSeconds = Math.floor((now - messageDate) / 1000);

            if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
            else if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
            else if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
            else return `${Math.floor(diffInSeconds / 86400)} days ago`;
        };
        vm.scrollToBottom = function() {
            $timeout(function() {
                var messageListElement = document.getElementById('messageList');
                messageListElement.scrollTop = messageListElement.scrollHeight;
            }, 0);
        };
        $timeout(vm.scrollToBottom, 0);

        angular.element($window).on('storage', function(event) {
            if (event.key === 'chatMessages') {
                vm.loadMessages();
                $scope.$apply();
            }
        });
    }]);
