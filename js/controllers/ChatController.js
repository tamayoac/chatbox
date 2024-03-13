angular.module('chatbox', [])
    .controller('ChatController', ['$scope', '$window', function($scope, $window) {
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

        // Send a message
        vm.sendMessage = function() {
            if (vm.message.trim() !== '') {
                let newMessage = { user: vm.userName, message: vm.message, timestamp: new Date().toISOString() };
                let savedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
                savedMessages.push(newMessage);
                localStorage.setItem('chatMessages', JSON.stringify(savedMessages));
                vm.messages.push(newMessage);
                vm.message = ''; // Clear message input
            }
        };

        // Listen for messages from other tabs
        angular.element($window).on('storage', function(event) {
            if (event.key === 'chatMessages') {
                vm.loadMessages();
                $scope.$apply();
            }
        });
    }]);
