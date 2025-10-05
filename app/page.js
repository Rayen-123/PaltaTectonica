export default function Page() {
	return (
		<>
			<div class="contenedor">
				<div class="encabezado"></div>
				<div class="main">
					<div class="lateral">
						<button class="calendario">Calendario</button>
						<button class="recetas">Recetas</button>
						<button class="lista">Lista</button>
					</div>
					<div class="principal">
						<div class="semana">
							<h2>Semana</h2>
							<div class="dia">
								<h5>Lunes</h5>
								<div class="comidas">
								<button class="comida">Almuerzo</button>
								<button class="comida">Cena</button>
								</div>
							</div>
							<div class="dia">
								<h5>Martes</h5>
								<div class="comidas">
								<button class="comida">Almuerzo</button>
								<button class="comida">Cena</button>
								</div>
							</div>
							<div class="dia">
								<h5>Miércoles</h5>
								<div class="comidas">
								<button class="comida">Almuerzo</button>
								<button class="comida">Cena</button>
								</div>
							</div>
							<div class="dia">
								<h5>Jueves</h5>
								<div class="comidas">
								<button class="comida">Almuerzo</button>
								<button class="comida">Cena</button>
								</div>
							</div>
							<div class="dia">
								<h5>Viernes</h5>
								<div class="comidas">
								<button class="comida">Almuerzo</button>
								<button class="comida">Cena</button>
								</div>
							</div>
							<div class="dia">
								<h5>Sábado</h5>
								<div class="comidas">
								<button class="comida">Almuerzo</button>
								<button class="comida">Cena</button>
								</div>
							</div>
							<div class="dia">
								<h5>Domingo</h5>
								<div class="comidas">
								<button class="comida">Almuerzo</button>
								<button class="comida">Cena</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}