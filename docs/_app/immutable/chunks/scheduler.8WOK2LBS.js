function k(){}function x(t,n){for(const e in n)t[e]=n[e];return t}function w(t){return t()}function z(){return Object.create(null)}function j(t){t.forEach(w)}function F(t){return typeof t=="function"}function P(t,n){return t!=t?n==n:t!==n||t&&typeof t=="object"||typeof t=="function"}function S(t){return Object.keys(t).length===0}function E(t,...n){if(t==null){for(const o of n)o(void 0);return k}const e=t.subscribe(...n);return e.unsubscribe?()=>e.unsubscribe():e}function U(t,n,e){t.$$.on_destroy.push(E(n,e))}function A(t,n,e,o){if(t){const c=g(t,n,e,o);return t[0](c)}}function g(t,n,e,o){return t[1]&&o?x(e.ctx.slice(),t[1](o(n))):e.ctx}function B(t,n,e,o){if(t[2]&&o){const c=t[2](o(e));if(n.dirty===void 0)return c;if(typeof c=="object"){const a=[],f=Math.max(n.dirty.length,c.length);for(let s=0;s<f;s+=1)a[s]=n.dirty[s]|c[s];return a}return n.dirty|c}return n.dirty}function C(t,n,e,o,c,a){if(c){const f=g(n,e,o,a);t.p(f,c)}}function D(t){if(t.ctx.length>32){const n=[],e=t.ctx.length/32;for(let o=0;o<e;o++)n[o]=-1;return n}return-1}let i;function d(t){i=t}function m(){if(!i)throw new Error("Function called outside component initialization");return i}function G(t){m().$$.on_mount.push(t)}function H(t){m().$$.after_update.push(t)}const l=[],b=[];let u=[];const h=[],y=Promise.resolve();let p=!1;function v(){p||(p=!0,y.then(q))}function I(){return v(),y}function O(t){u.push(t)}function J(t){h.push(t)}const _=new Set;let r=0;function q(){if(r!==0)return;const t=i;do{try{for(;r<l.length;){const n=l[r];r++,d(n),M(n.$$)}}catch(n){throw l.length=0,r=0,n}for(d(null),l.length=0,r=0;b.length;)b.pop()();for(let n=0;n<u.length;n+=1){const e=u[n];_.has(e)||(_.add(e),e())}u.length=0}while(l.length);for(;h.length;)h.pop()();p=!1,_.clear(),d(t)}function M(t){if(t.fragment!==null){t.update(),j(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(O)}}function K(t){const n=[],e=[];u.forEach(o=>t.indexOf(o)===-1?n.push(o):e.push(o)),e.forEach(o=>o()),u=n}export{B as a,U as b,A as c,H as d,b as e,z as f,D as g,q as h,F as i,S as j,O as k,K as l,i as m,k as n,G as o,d as p,w as q,j as r,P as s,I as t,C as u,l as v,v as w,J as x};