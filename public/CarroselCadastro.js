const swiper = new Swiper('.swiper', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 1.2,
    loop: true,
    spaceBetween: 40,
    coverflowEffect: {
      rotate: 20,
      stretch: 0,
      depth: 150,
      modifier: 1,
      slideShadows: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      768: {
        slidesPerView: 'auto',
      }
    }
  });

  const tipoBeneficiario = document.getElementById('tipoBeneficiario');
  const instituicaoFields = document.getElementById('instituicaoFields');
  const pessoaFields = document.getElementById('pessoaFields');

  tipoBeneficiario.addEventListener('change', () => {
    if (tipoBeneficiario.value === 'instituicao') {
      instituicaoFields.classList.remove('hidden');
      pessoaFields.classList.add('hidden');
    } else {
      pessoaFields.classList.remove('hidden');
      instituicaoFields.classList.add('hidden');
    }
  });