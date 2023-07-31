$(document).ready(function () {

    $('#game-board').click(function (e) {
        const x = e.pageX - $(this).offset().left;
        const y = e.pageY - $(this).offset().top;

        /*let array
        array.push(`{x: ${x}, y: ${y}},`)

        console.log(array)*/

        console.log(`X: ${x}, Y: ${y}`);
    });

    const questions = [
        "¿Qué entiendes por política fiscal?",
        "¿Qué es un presupuesto Federal?",
        "¿En cuánto tiempo se aprueba un presupuesto Federal en Bolivia?",
        "¿Quién elabora el presupuesto Federal en Bolivia?",
        "¿Cuáles son los tres componentes de un presupuesto Federal?",
        "¿Qué son los ingresos o recaudación tributaria?",
        "¿Qué representan los gastos en una política fiscal?",
        "¿Cuándo el gobierno presenta un déficit presupuestario?",
        "¿Cuándo el gobierno presenta un superávit presupuestario?",
        "¿En qué consiste el pleno empleo?",
        "¿De qué forma la política fiscal influye en el pleno empleo?",
        "¿Qué es el impuesto sobre la renta?",
        "¿Qué es el impuesto sobre el gasto?",
        "¿Para qué sirve la curva de Laffer?",
        "¿Qué es la inversión?",
        "¿Qué es el ahorro del gobierno?",
        "¿Para qué sirve la contabilidad generacional?",
        "¿Qué es la deuda externa?",
        "¿Qué son los estabilizadores automáticos?",
        "¿Cuáles son los estabilizadores automáticos?"
    ];

    const specialCells = {
        punishment: [17, 24],
        reward: [5, 9, 13, 18],
        question: [2, 4, 6, 8, 10, 12, 15, 19, 21, 23],
    };

    const playerColors = [
        'red', 'blue', 'green', 'yellow',
        'purple', 'orange', 'pink', 'brown',
        'cyan', 'lime', 'magenta', 'gold',
        'silver', 'maroon', 'navy', 'olive'
    ];

    const coordinates = [
        { x: 111.5, y: 610 }, { x: 225.5, y: 633 }, { x: 342.5, y: 641 }, { x: 449.5, y: 639 },
        { x: 551.5, y: 639 }, { x: 588.5, y: 540 }, { x: 483.5, y: 502 }, { x: 365.5, y: 521 },
        { x: 255.5, y: 536 }, { x: 159.5, y: 513 }, { x: 66.5, y: 451 },  { x: 137.5, y: 375 },
        { x: 244.5, y: 379 }, { x: 337.5, y: 393 }, { x: 457.5, y: 416 }, { x: 555.5, y: 409 },
        { x: 593.5, y: 317 }, { x: 491.5, y: 274 }, { x: 386.5, y: 268 }, { x: 274.5, y: 279 },
        { x: 167.5, y: 280 }, { x: 80.5, y: 240 },  { x: 97.5, y: 147 },  { x: 214.5, y: 136 },
        { x: 327.5, y: 136 }, { x: 457.5, y: 151 }, { x: 595.5, y: 178 }
    ];

    let players = [];
    let currentPlayerIndex = 0;

    function setupPlayers(numPlayers) {
        $('#players').empty();
        players = [];
        for (let i = 0; i < numPlayers; i++) {
            const offsetX = (i % 2) * 10;
            const offsetY = Math.floor(i / 2) * 10;

            const player = {
                position: 0,
                element: $('<div></div>').addClass('player')
                    .css('backgroundColor', playerColors[i % playerColors.length])
                    .css('left', (coordinates[0].x + offsetX) + 'px')
                    .css('top', (coordinates[0].y + offsetY) + 'px')
            };
            $('#players').append(player.element);
            players.push(player);
        }

        //$('#imagen-dado').prop('disabled', false);
        $('#imagen-dado').show();
        $('#start-button').prop('disabled', true);
        $('#numPlayers').prop('disabled', true);
    }

    function movePlayer(player, newPosition) {
        let promise = $.Deferred().resolve().promise();
        for (let pos = player.position + 1; pos <= newPosition; pos++) {
            const move = function() {

                const offset = players.indexOf(player) * 4;

                return player.element.animate({
                    left: coordinates[pos].x + offset + 'px',
                    top: coordinates[pos].y  + offset + 'px'
                }, 500).promise();
            }
            promise = promise.then(move);
        }

        promise.then(() => {
            player.position = newPosition;
            if (newPosition >= coordinates.length - 1) {
                $('#status').text(`¡Felicidades! El jugador ${currentPlayerIndex + 1} ha ganado el juego.`);
            } else {
                currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
            }
        });
    }

    function playTurn() {
        const player = players[currentPlayerIndex];
        const dice = rollDice();


        // Configura una animación que muestre una secuencia de números antes de mostrar el resultado final
        let currentRoll = 1;
        let interval = setInterval(function() {
            console.log(currentRoll)
            document.getElementById('imagen-dado').src = `imagenes/dado_${currentRoll}.png`;
            currentRoll++;
            if (currentRoll > 6) currentRoll = 1;
        }, 100); // Cambia el número cada 100 milisegundos

        // Detiene la animación después de un tiempo y muestra el resultado final
        setTimeout(function() {
            clearInterval(interval);
            document.getElementById('imagen-dado').src = `imagenes/dado_${dice}.png`;
            //console.log(`Resultado del dado: ${finalRoll}`);
            // Más lógica para manejar el resultado del dado, mover jugadores, etc.

            // Re-enable el clic en el dado
            document.getElementById('imagen-dado').style.pointerEvents = 'auto';


            $('#status').text(`El jugador ${currentPlayerIndex + 1} ha lanzado un ${dice}.`);

            let newPosition = player.position + dice;

            if ([5, 9, 13, 18].includes(newPosition)) {
                $('#status').append(` <span class="text-success">Avanza 2 casillas.</span>`);
                newPosition += 2;
            }

            if ([16, 24].includes(newPosition)) {
                $('#status').append(` <span class="text-warning">Retrocede 2 casillas.</span>`);
                newPosition -= 2;
            }

            if ([2, 4, 6, 8, 10, 12, 15, 19, 21, 23].includes(newPosition)) {
                const questionNumber = Math.floor(Math.random() * 19) + 1;
                //$('#status').append(` Responde a la pregunta número ${questionNumber}.`);

                Swal.fire(
                  questions[questionNumber],
                  'Pregunta nro. '+questionNumber,
                  'question'
                )
            }

            movePlayer(player, newPosition);
            }, 1000); // Duración total de la animación


        
       
    }
    
    function rollDice() {
        const finalRoll = Math.floor(Math.random() * 6) + 1;

        return finalRoll;
    }

    function resetGame() {
        currentPlayerIndex = 0;
        $('#numPlayers').prop('disabled', false);
        $('#start-button').prop('disabled', false);
        $('#status').text('');

        setupPlayers($('#numPlayers').val());
    }

    $('#start-button').click(function() {
        const numPlayers = parseInt($('#numPlayers').val());
        setupPlayers(numPlayers);
    });
    $('#imagen-dado').click(playTurn);
    $('#reset-button').click(resetGame);

    $('#imagen-dado').hide();
});
