export const openFileInNewTab = async (url: string) => {
  const token = localStorage.getItem('token')
  
  if (!token) {
    console.error('No authentication token found')
    return
  }

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch file')
    }
    
    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    const newWindow = window.open(blobUrl, '_blank')
    
    if (newWindow) {
      newWindow.onload = () => {
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
      }
    }
  } catch (error) {
    console.error('Error opening file:', error)
    alert('Erreur lors de l\'ouverture du fichier')
  }
}
