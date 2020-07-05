"use strict"

const $content = document.querySelector('#content');

window.location.hash = '';

document.querySelector('#add-new').addEventListener('click', ()=> {
    openModal();
    window.location.hash = '#add-new';
});

document.querySelector('#search').addEventListener('submit', (e) => {
    e.preventDefault();
    window.location.hash = '#search';
    const filmList = localStorage.storedFilms ? JSON.parse(localStorage.storedFilms) : [];
    const searchResult = filmList.filter(film => { 
        return film.title.toLowerCase().includes(e.target.query.value.toLowerCase());
    })
    showMovies(searchResult);
});


function openModal(id_film) {
    
    fetch('./add-new.html')
        .then(res => res.text())
        .then(data => {
            let modal = document.createElement('div');
            $(modal).attr({"class":"modal fade", "tabindex":"-1", "role":"dialog", "aria-hidden":"true"})
            .html(data)
            .modal('show');
            $(modal).on('hidden.bs.modal', () => {
                $(modal).remove();
            })

            const form = modal.querySelector('.modalForm');
            const $field = modal.querySelector('.field');

            let poster ='';
            let votesPos = 0;
            let votesNeg = 0;

            if(id_film) {
                
                const film_info = JSON.parse(localStorage.getItem(id_film));
                let {
                    title,
                    origin,
                    year,
                    poster : p,
                    votesPos : pos,
                    votesNeg : neg,
                    country,
                    tagline,
                    producer,
                    crew,
                    actors,
                    imdb,
                    describ 
                } = film_info;

                form.filmName.value = title;
                form.nameOrigin.value = origin;
                form.year.value = year;
                form.country.value = country;
                form.tagline.value = tagline;
                form.producer.value = producer;
                form.actors.value = actors;
                form.imdb.value = imdb;
                form.describ.value = describ;
                form.poster.nextElementSibling.textContent = p.split(';', 1);
                poster = p;
                votesPos = pos;
                votesNeg = neg;
               
                ////хотела сделать деструктуризацию, но он меня не понял.. не заполняет поля формы которые уже заполнены ((почему?
                /*let {
                        elements: {
                            filmName: {
                                value = test
                            },
                            year: {
                                value: yeartest
                            }
                        }
                    } = form;

                    //test = title;
                    yeartest = year*/

                 //console.log(yeartest);           

                crew.forEach((e,i) => {
                    if(i > 0){
                        addMemberOfCrew($field);
                    }
                })

                form.querySelectorAll('.crew').forEach((el, index) => {
                    crew.forEach((e, i) => {
                        const {position: positionValue, memberName: memberNameValue} = e;

                        if(index === i){
                            el.querySelector('.position').value = positionValue;
                            el.querySelector('.memberName').value = memberNameValue;
                            
                            //ПОЧЕМУ не работает код ниже ???*/

                           /* let [{
                                firstElementChild: {
                                    value: p
                                }
                            },
                            {
                                firstElementChild: {
                                    value: m
                                }
                            }
                            ] = el.children;
                           p = positionValue;
                           m = memberNameValue;*/
                        }
                    })
                });

            }

            modal.querySelector('.btn-add-field').addEventListener('click', (e) => {
                addMemberOfCrew($field);
            })

            removeMemberOfCrew($field);
            
            modal.querySelector('input[type=file]').addEventListener('change', (e) => {
                e.target.nextElementSibling.textContent = e.target.value;
                previewFile(e.target);
            })

            function previewFile(target) {
                let file    = target.files[0];
                let reader  = new FileReader();

                if (file) {
                    reader.readAsDataURL(file);
                } else {
                    poster = "";
                }
                
                reader.onloadend = function () {
                    poster = reader.result;
                }  
            }
                
            
            modal.querySelector('.saveBtn').addEventListener('click', (e) => {
                
                e.preventDefault();
                const filmList = localStorage.storedFilms ? JSON.parse(localStorage.storedFilms) : [];
                const {
                    elements: {
                        filmName: {
                            value: title
                        },
                        nameOrigin: {
                            value: origin
                        },
                        year: {
                            value: year 
                        },
                        country: {
                            value: country
                        },
                        tagline: {
                            value: tagline
                        },
                        producer: {
                            value: producer
                        },
                        actors: {
                            value: actors
                        },
                        imdb: {
                            value: imdb
                        },
                        describ: {
                            value: describ
                        }
                    }
                } = form;

                let crew = [];

                form.querySelectorAll('.crew').forEach(e => {
                    
                    const [{
                            firstElementChild: {
                                value: position
                            }
                        },
                        {
                            firstElementChild: {
                                value: memberName
                            }
                        }
                    ] = e.children;
                   
                    crew.push({
                        position,
                        memberName
                    })
                });
                

                let id = '';

                if(id_film) {
                    id = id_film;
                    filmList.find(e => {
                        return(e.id === id_film);
                    }).title = title;
                } else {
                    id = `film_id_${Date.now()}`;
                    filmList.push({
                        id,
                        title
                    });
                }
                
                localStorage.setItem(id, JSON.stringify({
                    title,
                    origin,
                    year,
                    votesPos,
                    votesNeg,
                    poster,
                    country,
                    tagline,
                    producer,
                    actors,
                    crew,
                    imdb,
                    describ
                }));
              
                localStorage.storedFilms = JSON.stringify(filmList);
                $(modal).modal('hide');
                window.location.hash = '#list';
            })
        })
}

function addMemberOfCrew(node) {
    const inner = `<div class="col-sm-5"><input type="text" class="form-control position" placeholder="Должность"></div>`+
        '<div class="col-sm-5"><input type="text" class="form-control memberName" placeholder="Имя"></div>'+
        '<div class="col-sm-2"><button class="btn btn-danger btn-sm btn-remove-field" type="button"><svg class="octicon octicon-x" viewBox="0 0 14 18" version="1.1" width="14" height="18" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg></button></div>'
    const $newOfCrew = document.createElement('div');
    $newOfCrew.classList.add('form-group', 'row', 'crew');
    $newOfCrew.innerHTML = inner;
    node.append($newOfCrew);
    removeMemberOfCrew($newOfCrew);
}
function removeMemberOfCrew(node) {
    node.querySelector('.btn-remove-field').addEventListener('click', e => {
        e.target.closest('.crew').remove(); 
        console.log('click');
    })
}

function showMovies(filmList) {
    fetch('./card.html')
        .then(res => res.text())
        .then(data => {
    
           $content.innerHTML = filmList.reduce((acc, film) => {
                const {title, describ, imdb, poster} = JSON.parse(localStorage.getItem(film.id));
                const imdbShort = (Math.floor(imdb/100)/10).toFixed(2);
                const currentFilm = template( {title, describ, imdb, imdbShort}, data);
                $content.innerHTML = currentFilm;
                const $film = $content.querySelector('.card');
                $film.classList.add('currentFilm');
                $film.setAttribute('film_id', film.id);
                $film.querySelector('.more').setAttribute('href', '#list-'+ film.id);
                $film.querySelector('.card-img').src = poster;
                $film.querySelector('.card-img').alt = title;

                return acc += $film.outerHTML;

            }, '');

            $('.btn-delete').click((el)=> {
                $('body').append('<div class = "overlay"></div>');
                $('body').append('<div class = "modal_del"><p>Ты уверен?</p>'+
                '<button class="yes" type="button">ДА!</button><button class="no" type="button">Неа...</button></div>');

                $('.modal_del .yes').click(function(e) {
                    closeModal(e.target);
                    deleteFilm(el);
                })
                $('.modal_del .no').click(function(e) {
                    closeModal(e.target);
                })

                function closeModal(target) {
                    $(target).parent().remove();
                    $('.overlay').remove();
                }


 //Хотела сделать по аналогии с модалкой "новый фильм", но код ниже модалку отрисовывает, а прятать не хочет... так и не смогла понять почему???

                    /*let modalDel = document.createElement('div');
                    $(modalDel).attr({"class":"modal del fade", "tabindex":"-1", "role":"dialog", "aria-hidden":"true"})
                    .html('<p>Ты уверен?</p><button  class="yes" type="button">ДА!</button><button class="no" type="button">Неа...</button>')
                    .modal('show');*/
                    
                   /* $(modalDel).click(function () {
                        console.log($(modalDel)); эта строка отрабатывает
                        
                        $(modalDel).modal('hide'); //Хоть  ты тресни не хотел здесь прятать модалку- так и не поняла почему..?

                        $(modalDel).on('hidden.bs.modal', () => {
                            $(modalDel).remove();
                        })
                        //deleteFilm(el);
                    })*/
                        
               
            })  

            document.querySelectorAll('.btn-edit').forEach((e) => {
                e.addEventListener('click', (el)=> {
                    openModal(getFilmId(el)); 
                    window.location.hash = '#edit';
                })
            })
            
            document.querySelectorAll('.more').forEach((e) => {
                e.addEventListener('click', (el)=> {
                    openMovie(el); 
                })
            })
        })
     
}

function openMovie(film) {
    const id = getFilmId(film);
    fetch('./movie.html')
        .then(res => res.text())
        .then(data =>{
            let {title, origin, year, country, tagline, producer, actors, crew, imdb, describ, poster, votesPos, votesNeg} = JSON.parse(localStorage.getItem(id));

            const imdbShort = (Math.floor(imdb/100)/10).toFixed(2);
            
            let actorsList= actors.split(', ').reduce((acc, actor) => {
                return acc += `<li>${actor}</li>`;
            }, '');

            let crewList = crew.reduce((acc, member) => {
                return acc += `<li class="d-flex"><p class="col-3">${member.position}</p><p class="col-9">${member.memberName}</p></li>`;
            },'');
            
            const currentFilm = template( {title, origin, tagline, year, country, producer, imdb, imdbShort, describ, actorsList, crewList}, data);
            $content.innerHTML = currentFilm;
           
            $content.querySelector('.img-fluid').src = poster;

            document.querySelector('.pos').dataset.count = votesPos;
            document.querySelector('.neg').dataset.count = votesNeg;

            document.querySelector('.pos').addEventListener('click', el => {  
                votesCounter(el, id, 'votesPos');
            })
            document.querySelector('.neg').addEventListener('click', el => {  
                votesCounter(el, id, 'votesNeg');
            })

            function votesCounter(el, id, attrName) {
                let film =  JSON.parse(localStorage.getItem(id));
                film[attrName] = ++el.currentTarget.dataset.count;
                localStorage.setItem(id, JSON.stringify(film));
            }
        })
}

function getFilmId(film) {
    return film.target.closest('.currentFilm').getAttribute('film_id');
}

function deleteFilm(film) {
    const id = getFilmId(film);
    localStorage.removeItem(id);
               
    const films =  JSON.parse(localStorage.storedFilms);
    
                
    const filmForDel = films.findIndex(function(el) {
        return (el.id === id); 
    });

    films.splice(filmForDel, 1);
    
    localStorage.storedFilms = JSON.stringify(films);     
    showMovies(films);
    document.forms.search.query.value = '';
}    

function template(data, tpl) {
    const f = (strings, ...values) => strings.reduce((res, item, index) => {
        return index === strings.length - 1 ? 
            res +=`${item}` :
            res += `${item}${data[values[index]]}`;
    }, '');

    return eval('f`' + tpl + '`');
}

window.addEventListener('hashchange', (e) => { 
    if(window.location.hash === '#list') {
        const filmList = localStorage.storedFilms ? JSON.parse(localStorage.storedFilms) : [];
        showMovies(filmList);
        document.forms.search.query.value = '';
    }
})





