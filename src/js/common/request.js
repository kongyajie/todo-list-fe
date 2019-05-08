import Ajax from './ajax';

function getTopDomain() {
  let domain = document.domain;
  if(domain == 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(domain)) return domain;
  let dArr = domain.split('.');
  if (dArr.length > 3) {
    domain = dArr.slice(-3).join('.');
  } else {
    domain = dArr.slice(-2).join('.');
  }
  return domain;
}
function  getDomain() {
  let protocol = window.location.protocol;
  let domain = getTopDomain();
  return (domain == 'localhost' ? `${protocol}//localhost:9011` : `${protocol}//${domain}`);
}

const Request = {
  todo: {
    getList() {
      return Ajax.get(`/todo/queryAll`, {});
    },
    add(params) {
      return Ajax.postJson(`/todo/create`, params);
    },
    remove(id) {
      return Ajax.postJson(`/todo/delete/${id}`);
    },
    allDone(params) {
      return Ajax.postJson(`/todo/allDone`, params);
    },
    setStatus(params) {
      return Ajax.postJson(`/todo/setStatus`, params);
    },
    removeCompleted() {
      return Ajax.postJson(`/todo/removeCompleted`);
    }
  },
};

module.exports = Request;
