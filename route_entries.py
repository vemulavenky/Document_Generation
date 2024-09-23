from . import (
    cost_center_route,
    country_code_route,
    document_type_route,
    file_number_route,
    project_route,
    user_route
    )

"""
add your protected route here
"""
PROTECTED_ROUTES = [
    
]


"""
add your public route here
"""
PUBLIC_ROUTES = [
    cost_center_route.router,
    country_code_route.router,
    document_type_route.router,
    project_route.router,
    file_number_route.router,
    user_route.router

]
