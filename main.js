"use strict"

const $content = document.querySelector('#content');
//
// const filmList = localStorage.storedFilms ? JSON.parse(localStorage.storedFilms) : [];

document.querySelector('#add-new').addEventListener('click', ()=> {
    openModal();
    window.location.hash = '#add-new';
});

document.querySelector('#search').addEventListener('submit', (e) => {
    e.preventDefault();
    window.location.hash = '#search';
    const filmList = JSON.parse(localStorage.storedFilms);
    const searchResult = filmList.filter(film => { 
        return film.title.toLowerCase().includes(e.target.query.value.toLowerCase());
    })
    showMovies(searchResult);
});

/*function fillModal(id_film) {
    const film_info = localStorage.getItem(id_film);

} может в отдельную функцию?? */  

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

            if(id_film) {
                let film_info = JSON.parse(localStorage.getItem(id_film));
                let {
                    title,
                    origin,
                    year,
                    poster,
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
                form.poster.nextElementSibling.textContent = poster.split(';', 1);
               
                //хотела сделать деструктуризацию, но он меня не понял.. не заполняет поля формы которые уже заполнены ((почему?
                /*let {
                        elements: {
                            filmName: {
                                value: test
                            },
                            year: {
                                value: yeartest
                            }
                        }
                    } = form;

                    test = title;
                    yeartest = year*/

                 //console.log(test);   

                //const $field = modal.querySelector('.field');             
                
//нужно ли имя у формы crew?? если нет -удали везде

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

            let poster ='';

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
                

            modal.querySelector('input[type=file]').addEventListener('change', (e) => {
                e.target.nextElementSibling.textContent = e.target.value;
                previewFile(e.target);
            })
            
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

               /* function getBase64Image(img) {
                    let canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                
                    let ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);
                
                    let dataURL = canvas.toDataURL("image/png");
                
                    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
                }

                let test = getBase64Image(poster);*/
                //console.log(poster);

                

                localStorage.setItem(id, JSON.stringify({
                    title,
                    origin,
                    year,
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
                //showAllMovies();
            })
        })
}

/*document.querySelector('.all-movies').addEventListener('click', ()=> {
    //showAllMovies();
    window.location.hash = '#listtttt';
})*/

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

function showAllMovies() {
    const filmList = JSON.parse(localStorage.storedFilms);
    showMovies(filmList);
}


function showMovies(filmList) {
    fetch('./card.html')
        .then(res => res.text())
        .then(data => {
            
            const $allFilms = document.createElement('div');
            
            filmList.forEach((film) => {

                let {title, describ, imdb, poster} = JSON.parse(localStorage.getItem(film.id));
                const $film = document.createElement('div');
                const imdbShort = (Math.floor(imdb/100)/10).toFixed(2);
                $film.classList.add('currentFilm');
                $film.setAttribute('film_id', film.id);
                let currentFilm = template( {title, describ, imdb, imdbShort}, data);
                $film.innerHTML = currentFilm;
                $film.querySelector('.more').setAttribute('href', '#list-'+ film.id);
                $film.querySelector('.card-img').src = poster;
                $allFilms.append($film);
                
            })
            
            $content.firstElementChild.replaceWith($allFilms);

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
                        
                        
                    

                    //здесь не сложилось с jquery селектором - почему???
                    /*$('.del .yes').click(function () {
                        console.log('yes');
                    });*/
               
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
                   // const id = getFilmId(el);
                    //window.location.hash = `#list-${id}`;
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


            const $film = document.createElement('div');
            $film.innerHTML = currentFilm;
            $film.querySelector('.img-fluid').src = poster;

            $content.firstElementChild.replaceWith($film);



           /* document.querySelectorAll('.btn-text').forEach(e => {
                e.addEventListener('click', el => {  
                    el.currentTarget.dataset.count++;
                })
            })*/


            document.querySelector('.pos').dataset.count = votesPos ? votesPos : 0;
            document.querySelector('.neg').dataset.count = votesNeg ? votesNeg : 0;

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
    //let modal = document.createElement('div');
            /*$(modal).attr({"class":"modal_del fade", "tabindex":"-1", "role":"dialog", "aria-hidden":"true"})
            .html('<div><p>Ты уверен?</p><button type="button">Ok</button></div>')
            .modal('show');
            $(modal).on('hidden.bs.modal', () => {
                $(modal).remove();
            })*/
    const id = getFilmId(film);
    localStorage.removeItem(id);
               
    const films =  JSON.parse(localStorage.storedFilms);
    
                
    const filmForDel = films.findIndex(function(el) {
        return (el.id === id); 
    });

    films.splice(filmForDel, 1);
    
    localStorage.storedFilms = JSON.stringify(films);  
    showAllMovies();    
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
        const filmList = JSON.parse(localStorage.storedFilms);
        showMovies(filmList);
        document.forms.search.query.value = '';
    }
})





