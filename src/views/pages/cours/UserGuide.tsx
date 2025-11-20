import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBook, cilInfo } from '@coreui/icons'

const UserGuide: React.FC = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>
              <CIcon icon={cilBook} className="me-2" />
              Manuel d'Utilisation - Module Cours
            </strong>
          </CCardHeader>
          <CCardBody>
            <CAccordion activeItemKey={1}>
              
              {/* Introduction */}
              <CAccordionItem itemKey={1}>
                <CAccordionHeader>
                  <strong>1. Introduction au Module Cours</strong>
                </CAccordionHeader>
                <CAccordionBody>
                  <h5>Objectif du Module</h5>
                  <p>
                    Le module Cours permet de gérer l'ensemble de l'offre pédagogique de l'établissement. 
                    Il structure les enseignements en Unités d'Enseignement (UE), Éléments Constitutifs d'UE (ECUE), 
                    et permet d'associer les professeurs et ressources pédagogiques.
                  </p>
                  
                  <h5>Structure Hiérarchique</h5>
                  <ul>
                    <li><strong>Unité d'Enseignement (UE)</strong> : Regroupement thématique de cours</li>
                    <li><strong>Élément de Cours (ECUE)</strong> : Cours individuel appartenant à une UE</li>
                    <li><strong>Ressources Pédagogiques</strong> : Documents liés aux cours (syllabus, TD, TP, etc.)</li>
                    <li><strong>Association Matière-Professeur</strong> : Affectation des enseignants aux cours</li>
                    <li><strong>Programme</strong> : Attribution des cours aux classes avec pondération</li>
                  </ul>
                </CAccordionBody>
              </CAccordionItem>

              {/* Unités d'Enseignement */}
              <CAccordionItem itemKey={2}>
                <CAccordionHeader>
                  <strong>2. Gestion des Unités d'Enseignement (UE)</strong>
                </CAccordionHeader>
                <CAccordionBody>
                  <h5>Qu'est-ce qu'une UE ?</h5>
                  <p>
                    Une Unité d'Enseignement est un regroupement cohérent de cours autour d'une thématique commune.
                    Par exemple : "Mathématiques", "Informatique Fondamentale", "Sciences Humaines".
                  </p>

                  <h5>Comment créer une UE ?</h5>
                  <ol>
                    <li>Cliquez sur le bouton <CBadge color="primary">Nouvelle UE</CBadge></li>
                    <li>Remplissez les champs obligatoires :
                      <ul>
                        <li><strong>Nom</strong> : Nom complet de l'UE (ex: "Mathématiques Appliquées")</li>
                        <li><strong>Code</strong> : Code unique (ex: "UE-MATH-01")</li>
                      </ul>
                    </li>
                    <li>Cliquez sur <CBadge color="success">Créer</CBadge></li>
                  </ol>

                  <h5>Actions disponibles</h5>
                  <ul>
                    <li><strong>Voir détails</strong> : Affiche les informations complètes et les ECUE associés</li>
                    <li><strong>Modifier</strong> : Permet de modifier le nom ou le code</li>
                    <li><strong>Supprimer</strong> : Supprime l'UE (impossible si des ECUE y sont rattachés)</li>
                  </ul>
                </CAccordionBody>
              </CAccordionItem>

              {/* Éléments de Cours */}
              <CAccordionItem itemKey={3}>
                <CAccordionHeader>
                  <strong>3. Gestion des Éléments de Cours (ECUE)</strong>
                </CAccordionHeader>
                <CAccordionBody>
                  <h5>Qu'est-ce qu'un ECUE ?</h5>
                  <p>
                    Un Élément Constitutif d'Unité d'Enseignement est un cours spécifique. 
                    Chaque ECUE appartient obligatoirement à une UE et possède un nombre de crédits.
                  </p>

                  <h5>Comment créer un ECUE ?</h5>
                  <ol>
                    <li>Cliquez sur <CBadge color="primary">Nouvel ECUE</CBadge></li>
                    <li>Remplissez les informations :
                      <ul>
                        <li><strong>Nom</strong> : Intitulé du cours (ex: "Algèbre Linéaire")</li>
                        <li><strong>Code</strong> : Code unique (ex: "MATH-101")</li>
                        <li><strong>Crédits</strong> : Nombre de crédits ECTS (ex: 3)</li>
                        <li><strong>UE</strong> : Sélectionnez l'UE parente</li>
                      </ul>
                    </li>
                    <li>Validez avec <CBadge color="success">Créer</CBadge></li>
                  </ol>

                  <h5>Filtres et Recherche</h5>
                  <ul>
                    <li>Recherche par nom ou code</li>
                    <li>Filtrage par UE</li>
                    <li>Filtrage par nombre de crédits</li>
                  </ul>
                </CAccordionBody>
              </CAccordionItem>

              {/* Ressources Pédagogiques */}
              <CAccordionItem itemKey={4}>
                <CAccordionHeader>
                  <strong>4. Gestion des Ressources Pédagogiques</strong>
                </CAccordionHeader>
                <CAccordionBody>
                  <h5>Types de Ressources</h5>
                  <ul>
                    <li><strong>Syllabus</strong> : Programme détaillé du cours</li>
                    <li><strong>Cours</strong> : Support de cours magistral</li>
                    <li><strong>TD</strong> : Travaux Dirigés</li>
                    <li><strong>TP</strong> : Travaux Pratiques</li>
                    <li><strong>Examen</strong> : Sujets d'examens</li>
                  </ul>

                  <h5>Comment ajouter une ressource ?</h5>
                  <ol>
                    <li>Cliquez sur <CBadge color="primary">Nouvelle Ressource</CBadge></li>
                    <li>Remplissez le formulaire :
                      <ul>
                        <li><strong>Titre</strong> : Nom du document</li>
                        <li><strong>Type</strong> : Sélectionnez le type de ressource</li>
                        <li><strong>ECUE</strong> : Cours auquel rattacher la ressource</li>
                        <li><strong>Description</strong> : Détails optionnels</li>
                        <li><strong>Fichier</strong> : Document à uploader (PDF, Word, etc.)</li>
                        <li><strong>Public</strong> : Cochez si accessible aux étudiants</li>
                      </ul>
                    </li>
                    <li>Cliquez sur <CBadge color="success">Créer</CBadge></li>
                  </ol>

                  <h5>Visibilité des Ressources</h5>
                  <p>
                    <CBadge color="success">Public</CBadge> : Visible par les étudiants<br/>
                    <CBadge color="warning">Privé</CBadge> : Visible uniquement par les enseignants et administrateurs
                  </p>
                </CAccordionBody>
              </CAccordionItem>

              {/* Association Matière-Professeur */}
              <CAccordionItem itemKey={5}>
                <CAccordionHeader>
                  <strong>5. Association Matière-Professeur</strong>
                </CAccordionHeader>
                <CAccordionBody>
                  <h5>Principe</h5>
                  <p>
                    Cette section permet d'associer un ou plusieurs professeurs à un cours (ECUE). 
                    Un cours peut avoir un professeur principal et plusieurs professeurs secondaires.
                  </p>

                  <h5>Professeur Principal vs Secondaire</h5>
                  <ul>
                    <li><strong>Professeur Principal</strong> : Responsable du cours, un seul par cours</li>
                    <li><strong>Professeurs Secondaires</strong> : Interviennent ponctuellement (TD, TP, etc.)</li>
                  </ul>

                  <h5>Comment créer une association ?</h5>
                  <ol>
                    <li>Cliquez sur <CBadge color="primary">Nouvelle Association</CBadge></li>
                    <li>Sélectionnez :
                      <ul>
                        <li><strong>ECUE</strong> : Le cours concerné</li>
                        <li><strong>Professeur</strong> : L'enseignant à associer</li>
                        <li><strong>Type</strong> : Cochez "Principal" pour le professeur responsable</li>
                      </ul>
                    </li>
                    <li>Validez avec <CBadge color="success">Créer</CBadge></li>
                  </ol>

                  <div className="alert alert-info mt-3">
                    <CIcon icon={cilInfo} className="me-2" />
                    <strong>Important :</strong> Un cours ne peut avoir qu'un seul professeur principal. 
                    Si vous désignez un nouveau professeur principal, l'ancien devient automatiquement secondaire.
                  </div>
                </CAccordionBody>
              </CAccordionItem>

              {/* Programmes */}
              <CAccordionItem itemKey={6}>
                <CAccordionHeader>
                  <strong>6. Gestion des Programmes</strong>
                </CAccordionHeader>
                <CAccordionBody>
                  <h5>Qu'est-ce qu'un Programme ?</h5>
                  <p>
                    Un programme définit quels cours sont enseignés à quelle classe, avec quelle pondération 
                    pour les différentes évaluations (CC, TP, Examen).
                  </p>

                  <h5>Comment créer un programme ?</h5>
                  <ol>
                    <li>Cliquez sur <CBadge color="primary">Nouveau Programme</CBadge></li>
                    <li>Sélectionnez :
                      <ul>
                        <li><strong>Classe</strong> : Le groupe d'étudiants concerné</li>
                        <li><strong>Association Matière-Professeur</strong> : Le cours et son enseignant</li>
                      </ul>
                    </li>
                    <li>Définissez la pondération (doit totaliser 100%) :
                      <ul>
                        <li><strong>CC</strong> : Contrôle Continu (ex: 30%)</li>
                        <li><strong>TP</strong> : Travaux Pratiques (ex: 20%)</li>
                        <li><strong>Examen</strong> : Examen final (ex: 50%)</li>
                      </ul>
                    </li>
                    <li>Cliquez sur <CBadge color="success">Créer</CBadge></li>
                  </ol>

                  <h5>Filtres disponibles</h5>
                  <ul>
                    <li>Par classe</li>
                    <li>Par cours</li>
                    <li>Par professeur</li>
                  </ul>
                </CAccordionBody>
              </CAccordionItem>

              {/* Workflow Complet */}
              <CAccordionItem itemKey={7}>
                <CAccordionHeader>
                  <strong>7. Workflow Complet - Exemple Pratique</strong>
                </CAccordionHeader>
                <CAccordionBody>
                  <h5>Scénario : Mise en place d'un nouveau cours</h5>
                  
                  <h6>Étape 1 : Créer l'UE (si nécessaire)</h6>
                  <p>Créez "Informatique Fondamentale" avec le code "UE-INFO-01"</p>

                  <h6>Étape 2 : Créer l'ECUE</h6>
                  <p>Créez "Programmation Python" (code: INFO-101, 4 crédits) dans l'UE "Informatique Fondamentale"</p>

                  <h6>Étape 3 : Ajouter les ressources</h6>
                  <ul>
                    <li>Uploadez le syllabus du cours</li>
                    <li>Ajoutez les supports de cours</li>
                    <li>Ajoutez les énoncés de TP</li>
                  </ul>

                  <h6>Étape 4 : Associer les professeurs</h6>
                  <ul>
                    <li>Associez le Prof. DUPONT comme professeur principal</li>
                    <li>Associez le Prof. MARTIN comme professeur secondaire (pour les TP)</li>
                  </ul>

                  <h6>Étape 5 : Créer le programme</h6>
                  <ul>
                    <li>Sélectionnez la classe "Licence 1 - Groupe A"</li>
                    <li>Sélectionnez l'association "Programmation Python - Prof. DUPONT"</li>
                    <li>Définissez la pondération : CC 30%, TP 30%, Examen 40%</li>
                  </ul>
                </CAccordionBody>
              </CAccordionItem>

              {/* Bonnes Pratiques */}
              <CAccordionItem itemKey={8}>
                <CAccordionHeader>
                  <strong>8. Bonnes Pratiques</strong>
                </CAccordionHeader>
                <CAccordionBody>
                  <h5>Codes et Nomenclature</h5>
                  <ul>
                    <li>Utilisez des codes cohérents et uniques</li>
                    <li>Préfixez par le domaine (ex: MATH-, INFO-, PHYS-)</li>
                    <li>Numérotez de manière logique (101, 102, 201, 202...)</li>
                  </ul>

                  <h5>Organisation des Ressources</h5>
                  <ul>
                    <li>Nommez clairement vos fichiers</li>
                    <li>Utilisez le bon type de ressource</li>
                    <li>Mettez à jour régulièrement</li>
                    <li>Marquez comme "Public" uniquement ce qui doit être visible par les étudiants</li>
                  </ul>

                  <h5>Gestion des Professeurs</h5>
                  <ul>
                    <li>Désignez toujours un professeur principal</li>
                    <li>Documentez les rôles des professeurs secondaires</li>
                    <li>Vérifiez les associations avant de créer les programmes</li>
                  </ul>

                  <h5>Pondérations</h5>
                  <ul>
                    <li>Assurez-vous que la somme fait toujours 100%</li>
                    <li>Respectez les règles pédagogiques de l'établissement</li>
                    <li>Documentez les changements de pondération</li>
                  </ul>
                </CAccordionBody>
              </CAccordionItem>

              {/* FAQ */}
              <CAccordionItem itemKey={9}>
                <CAccordionHeader>
                  <strong>9. Questions Fréquentes (FAQ)</strong>
                </CAccordionHeader>
                <CAccordionBody>
                  <h5>Puis-je supprimer une UE qui contient des ECUE ?</h5>
                  <p>Non, vous devez d'abord supprimer ou réaffecter tous les ECUE de cette UE.</p>

                  <h5>Comment changer le professeur principal d'un cours ?</h5>
                  <p>Créez une nouvelle association avec le nouveau professeur et cochez "Principal". 
                  L'ancien professeur principal deviendra automatiquement secondaire.</p>

                  <h5>Que se passe-t-il si je supprime un professeur ?</h5>
                  <p>Toutes ses associations et programmes seront également supprimés. 
                  Assurez-vous de réaffecter ses cours avant.</p>

                  <h5>Puis-je modifier la pondération d'un programme existant ?</h5>
                  <p>Oui, utilisez le bouton "Modifier" sur le programme concerné.</p>

                  <h5>Comment rendre une ressource visible aux étudiants ?</h5>
                  <p>Cochez la case "Public" lors de la création ou modification de la ressource.</p>
                </CAccordionBody>
              </CAccordionItem>

            </CAccordion>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default UserGuide
