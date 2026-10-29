import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "./api/queryClient.ts";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css';
import {pages} from "./utils/constants.ts";
import NavBar from "./components/NavBar";
import BackendStatusBanner from "./components/BackendStatusBanner";
import HomePage from "./pages/HomePage";
import Footer from "./components/Footer";
import AdvancedSearchPage from "./pages/search/AdvancedSearchPage";
import SearchResultsPage from "./pages/search/SearchResultsPage";
import OptionsPage from "./pages/OptionsPage";
import PersonAllInformationPage from "./pages/results/person/PersonAllInformationPage.tsx";
import PersonPersonalInformationPage from "./pages/results/person/PersonPersonalInformationPage.tsx";
import PersonOrganizationsPage from "./pages/results/person/PersonOrganizationsPage.tsx";
import PersonResearchesPage from "./pages/results/person/PersonResearchesPage.tsx";
import PersonShareResearchResultsPage from "./pages/results/person/advanced/PersonShareResearchResultsPage.tsx";
import PersonCollaboratingOrganizationsPage from "./pages/results/person/advanced/PersonCollaboratingOrganizationsPage.tsx";
import PersonEnrichPage from "./pages/results/person/advanced/PersonEnrichPage.tsx";
import OrganizationAllInformationPage from "./pages/results/organization/OrganizationAllInformationPage.tsx";
import OrganizationPersonsRelatedPage from "./pages/results/organization/OrganizationPersonsRelatedPage.tsx";
import OtherInformationPage from "./pages/results/OtherInformationPage.tsx";
import ExploreCollaborationsPage from "./pages/collabs/ExploreCollaborationsPage.tsx";
import CollabsResultsPage from "./pages/collabs/CollabsResultsPage.tsx";
import OSLPage from "./pages/osl/OSLPage.tsx";
/*
import OSProfileResultPage from "./pages/osl/OSProfileResultPage.tsx";
import OSDashboardResultPage from "./pages/osl/OSDashboardResultPage.tsx";
*/
import SearchPage from "./pages/search/SearchPage.tsx";
import OrganizationAnyInformationPersonsPage
    from "./pages/results/organization/OrganizationAnyInformationPersonsPage.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false}/>}
            <BrowserRouter>
                <NavBar/>
                <BackendStatusBanner/>
                <Routes>
                    <Route path={'*'} element={<HomePage/>}/>
                    <Route path={'/'} element={<HomePage/>}/>

                    <Route path={pages.SEARCH_BROAD} element={<SearchPage/>}/>
                    <Route path={pages.SEARCH_ADVANCED} element={<AdvancedSearchPage/>}/>
                    <Route path={pages.SEARCH} element={<SearchPage/>}/>

                    <Route path={pages.SEARCH_RESULTS} element={<SearchResultsPage/>}/>

                    <Route path={pages.OPTIONS} element={<OptionsPage/>}/>

                    <Route path={pages.RESULTS_PERSON_ALL} element={<PersonAllInformationPage/>}/>
                    <Route path={pages.RESULTS_PERSON_PERSONAL} element={<PersonPersonalInformationPage/>}/>
                    <Route path={pages.RESULTS_PERSON_ORGANIZATION} element={<PersonOrganizationsPage/>}/>
                    <Route path={pages.RESULTS_PERSON_RESEARCH} element={<PersonResearchesPage/>}/>
                    <Route path={pages.RESULTS_PERSON_SHARE_RESEARCH} element={<PersonShareResearchResultsPage/>}/>
                    <Route path={pages.RESULTS_PERSON_COLLABORATING_ORGANIZATIONS}
                           element={<PersonCollaboratingOrganizationsPage/>}/>
                    <Route path={pages.RESULTS_PERSON_ENRICH} element={<PersonEnrichPage/>}/>

                    <Route path={pages.RESULTS_ORGANIZATION_ALL} element={<OrganizationAllInformationPage/>}/>
                    <Route path={pages.RESULTS_ORGANIZATION_PERSONS} element={<OrganizationPersonsRelatedPage/>}/>
                    <Route path={pages.RESULTS_ORGANIZATION_ANY_INFO_PERSONS}
                           element={<OrganizationAnyInformationPersonsPage/>}/>

                    <Route path={pages.RESULTS_OTHER} element={<OtherInformationPage/>}/>

                    <Route path={pages.EXPLORE_COLLABORATIONS} element={<ExploreCollaborationsPage/>}/>
                    <Route path={pages.COLLABS_RESULTS} element={<CollabsResultsPage/>}/>
                    <Route path={pages.OPEN_SCIENCE_LANDSCAPE} element={<OSLPage/>}/>
                    {/*
                    <Route path={pages.OS_PROFILE_RESULTS} element={<OSProfileResultPage/>}/>
                    <Route path={pages.OS_DASHBOARD_RESULTS} element={<OSDashboardResultPage/>}/>
                    */}
                </Routes>
                <Footer/>
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>
)