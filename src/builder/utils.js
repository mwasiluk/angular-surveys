angular.module('mwFormBuilder')
    .service('uuid', function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        this.get = function () {
            return s4() + s4()  + s4() + s4() +s4() + s4() + s4() + s4();


        };
    });
/*    .factory('CollectionsUtil', function(){
        return{
            replaceByEqualObject: function(collection, referenceObjects, equalFn){
                return _.map(collection, function(element){
                    var foundRefObj = _.find(referenceObjects, function(refObj){
                        if(equalFn){
                            return equalFn(element, refObj);
                        }else{
                            return _.isEqual(element, refObj);
                        }
                    });
                    if(foundRefObj){
                        return foundRefObj;
                    }else{
                        return element;
                    }
                });
            },
            isNotEmptyArray: function(object){
                return object && $.isArray(object) && object.length > 0;
            }
        }
    });*/
