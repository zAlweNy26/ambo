<script lang="ts" setup>
const owner = "Daniele Nicosia"
</script>

<template>
	<section class="flex flex-col items-center grow">
		<h1 class="text-4xl font-bold text-[var(--ui-primary)]">Termini & Condizioni</h1>
		<p class="text-xl font-medium">Ultima modifica: 15 Gennaio 2023</p>
		<div id="terms" class="prose-sm prose max-w-[80ch] md:prose-base dark:prose-invert prose-headings:text-center prose-li:marker:text-[var(--ui-primary)] prose-li:marker:font-medium">
			<h2>Disposizioni generali</h2>
			<ol>
				<li>Questo sito web (il "Sito") è di proprietà e gestito da <strong>{{ owner }}</strong>. L'utilizzo
					del Sito è soggetto ai termini e alle condizioni contenuti in questi Termini di servizio
					("Termini"). Accedendo e utilizzando il Sito, l'utente accetta di essere vincolato ai presenti
					Termini.</li>
				<li>Il Sito offre una versione digitale del tradizionale gioco della tombola a solo scopo di
					intrattenimento. Il Sito è destinato a un pubblico di tutte le età e fornisce contenuti
					esclusivamente a scopo ricreativo e di intrattenimento.</li>
				<li>Ci riserviamo il diritto di modificare o interrompere il Sito in qualsiasi momento, con o senza
					preavviso.</li>
				<li>Il Sito non fornisce alcuna forma di scambio monetario o premi, quindi non è soggetto a regole delle
					normative di gioco d'azzardo.</li>
				<li>Il Sito non possiede alcun metodo di registrazione utente, quindi non può risalire in alcun modo
					all'identità dei giocatori. Nessun dato personale viene raccolto durante l'utilizzo del Sito.</li>
				<li>Per garantire massima trasparenza, l'estrazione dei numeri e la generazione delle cartelle vengono
					effettuate in modo casuale e sono gestite localmente, nessun dato di gioco viene salvato sui server
					del Sito.</li>
			</ol>
			<h2>Proprietà intellettuale</h2>
			<ol>
				<li>Il contenuto del Sito, tra cui testi, immagini, grafica, logo e codice sorgente, è protetto da
					copyright e altre leggi sulla proprietà intellettuale.</li>
				<li>L'utente non può utilizzare il contenuto del Sito per scopi commerciali senza il consenso scritto di
					<strong>{{ owner }}</strong>.</li>
			</ol>
			<h2>Limitazione di responsabilità</h2>
			<ol>
				<li>Il Sito e il suo contenuto sono forniti "così come sono" senza alcuna garanzia, espressa o
					implicita. <strong>{{ owner }}</strong> non garantisce che il Sito sia privo di errori o che il suo utilizzo sia
					continuo e privo di interruzioni.</li>
				<li>Il Sito non sarà in alcun modo responsabile per eventuali danni diretti, indiretti o consequenziali
					derivanti dall'utilizzo del Sito o del suo contenuto.</li>
			</ol>
			<h2>Utilizzo del Sito</h2>
			<ol>
				<li>L'utente si impegna a utilizzare il Sito in modo responsabile e conforme alle leggi vigenti.</li>
				<li>È vietato qualsiasi tentativo di manipolare il sistema di estrazione dei numeri o di interferire con
					il normale funzionamento del Sito.</li>
				<li>Il Sito è destinato esclusivamente a un uso personale e non commerciale.</li>
				<li>Gli utenti sono responsabili dell'uso appropriato del Sito e si impegnano a non utilizzarlo per
					scopi illeciti o fraudolenti.</li>
			</ol>
			<h2>Cookie e Tecnologie di Tracciamento</h2>
			<ol>
				<li>Il Sito utilizza esclusivamente cookie tecnici essenziali per il funzionamento base del sito.</li>
				<li>Non vengono utilizzati cookie di profilazione o tracciamento.</li>
				<li>La navigazione sul Sito non comporta alcuna raccolta di dati personali degli utenti.</li>
			</ol>
			<h2>Modifiche ai Termini</h2>
			<p>Ci riserviamo il diritto di modificare questi Termini in qualsiasi momento. Le modifiche entreranno in
				vigore immediatamente dopo la pubblicazione sul Sito. L'uso continuato del Sito dopo tali modifiche
				costituirà l'accettazione dei nuovi Termini.</p>
		</div>
	</section>
</template>

<style scoped>
#terms {
	counter-reset: heading;
}

h2:before {
	content: counter(heading)". ";
	counter-increment: heading;
}
</style>