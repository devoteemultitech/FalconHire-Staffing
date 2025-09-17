// Main script for FalconHire multi-file site
document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());

function contactReset(){
  const form = document.getElementById('contactForm');
  if(form){ form.reset(); }
  const status = document.getElementById('status');
  if(status) status.textContent = '';
}

// Formspree endpoint - REPLACE with your actual form ID
const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

async function submitForm(e){
  e.preventDefault();
  const status = document.getElementById('status');
  status.textContent = 'Sending...';
  const form = document.getElementById('contactForm');
  const data = new FormData(form);
  try{
    const res = await fetch(FORM_ENDPOINT, {method:'POST', headers:{'Accept':'application/json'}, body: data});
    if(res.ok){status.textContent='Message sent — we will contact you soon.';form.reset();}
    else {const json = await res.json();status.textContent = json?.error || 'Error sending message.'}
  }catch(err){status.textContent='Unable to send message. Check your FORM_ENDPOINT.'}
}

document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('contactForm');
  if(form){ form.addEventListener('submit', submitForm); }

  const startBtn = document.getElementById('startBtn');
  const demoBtn = document.getElementById('demoBtn');
  if(startBtn){
    startBtn.addEventListener('click', function(){
      document.getElementById('contact').scrollIntoView({behavior:'smooth'});
      // add a small highlight animation to contact form
      const card = document.querySelector('#contact .section-card') || document.querySelector('#contact');
      if(card){
        card.classList.add('highlight'); 
        setTimeout(()=> card.classList.remove('highlight'), 2000);
      }
    });
  }
  if(demoBtn){
    demoBtn.addEventListener('click', function(){
      // show a small modal-like demo request confirmation
      showDemoModal();
    });
  }
});

// Simple demo modal (no external libs)
function showDemoModal(){
  const modal = document.createElement('div');
  modal.style.position='fixed';
  modal.style.left=0; modal.style.top=0; modal.style.width='100%'; modal.style.height='100%';
  modal.style.display='grid'; modal.style.placeItems='center'; modal.style.background='rgba(2,6,23,0.6)';
  modal.style.zIndex=9999;
  modal.innerHTML = `
    <div style="background:#fff;padding:20px;border-radius:12px;max-width:520px;width:90%;box-shadow:0 12px 40px rgba(2,6,23,0.2);text-align:left;color:#06203a">
      <h3 style="margin-top:0">Request a Demo</h3>
      <p style="color:#385670">Enter your details and our team will contact you to schedule a product walkthrough.</p>
      <form id="demoForm" style="display:grid;gap:10px;margin-top:10px">
        <input name="demo_name" placeholder="Your name" required style="padding:10px;border-radius:8px;border:1px solid #e6eef6" />
        <input name="demo_email" type="email" placeholder="Email" required style="padding:10px;border-radius:8px;border:1px solid #e6eef6" />
        <input name="demo_phone" placeholder="Phone (optional)" style="padding:10px;border-radius:8px;border:1px solid #e6eef6" />
        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:6px">
          <button type="submit" style="background:linear-gradient(90deg,var(--accent),var(--accent-2));color:#fff;padding:8px 12px;border-radius:8px;border:0">Request</button>
          <button type="button" id="demoClose" style="background:transparent;padding:8px 12px;border-radius:8px;border:1px solid #cbd5e1">Cancel</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  // demo form handler uses Formspree too (same endpoint) - adjust server-side handling as needed
  const demoForm = modal.querySelector('#demoForm');
  demoForm.addEventListener('submit', async (ev)=>{
    ev.preventDefault();
    const fd = new FormData(demoForm);
    try{
      const res = await fetch(FORM_ENDPOINT, {method:'POST', body: fd, headers: {'Accept':'application/json'}});
      if(res.ok){
        alert('Demo request sent — we will contact you soon.');
        modal.remove();
      } else {
        alert('Error sending demo request.');
      }
    }catch(err){ alert('Unable to send demo request.'); }
  });

  modal.querySelector('#demoClose').addEventListener('click', ()=> modal.remove());
}

// small highlight CSS insertion for contact card
const style = document.createElement('style');
style.innerHTML = '.highlight{box-shadow:0 0 0 4px rgba(0,180,216,0.12);transform:translateY(-4px)}';
document.head.appendChild(style);
